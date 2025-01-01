import { emitter } from "../utils/emitter"

interface IGetAllOptions<T> {
    skip?: number
    limit?: number
    index?: keyof T
    filter?: string; // comma separated
    value?: any; // comma separated
    reverse?: boolean
    upperBound?: any
    lowerBound?: any
    openUpperBound?: boolean
    openLowerBound?: boolean
}

let dbIsReady = false

let dbReadyPromise: Promise<boolean> = new Promise((resolve, reject) => {
    emitter.on('db-ready', () => {
        dbIsReady = true
        resolve(true)
    })
})

function waitUntilDbIsReady(): Promise<boolean> {
    return dbReadyPromise
}

export default (dbName: string) => ({
    info(version?: number) {
        return new Promise<{ objectStoreNames: DOMStringList; version: number }>((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onsuccess = () => {
                const { objectStoreNames, version } = request.result
                request.result.close()
                return resolve({ objectStoreNames, version })
            }
            request.onupgradeneeded = () => {
                const { objectStoreNames, version } = request.result
                // Do not close DB here; the upgrade transaction is ongoing.
                return resolve({ objectStoreNames, version })
            }
            request.onerror = error => reject(error)
        })
    },
    createStore(name: string, version: number, options?: { keyPath: string; autoIncrement?: boolean; indices?: string[] }) {
        const opts = { keyPath: 'id', autoIncrement: true, indices: [], ...options }
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result
                const { keyPath, autoIncrement } = opts
                if (!db.objectStoreNames.contains(name)) {
                    const os = db.createObjectStore(name, { keyPath, autoIncrement })
                    opts.indices.forEach(index => os.createIndex(index, index, { unique: false }))
                }
            }

            request.onsuccess = (event) => {
                // The upgrade transaction is complete at this point
                (event.target as IDBOpenDBRequest).result.close()
                resolve(true)
            }

            request.onerror = (error) => {
                reject(error)
            }
        })
    },
    createindex(_store: string, version: number, index: string, options?: { unique?: boolean; multiEntry?: boolean }) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onupgradeneeded = (event) => {
                const target = event.target as IDBOpenDBRequest
                const db = target.result
                const upgradeTransaction = (event.currentTarget as IDBOpenDBRequest).transaction
                const os = upgradeTransaction.objectStore(_store)
                if (!os.indexNames.contains(index)) {
                    os.createIndex(index, index, { unique: options?.unique || false, multiEntry: options?.multiEntry || false })
                }
                // Don't close db here; let onsuccess handle closing if needed
            }
            request.onsuccess = (event: any) => {
                request.result.close()
                return resolve(event)
            }
            request.onerror = error => reject(error)
        })
    },
    async save(store: string, object: any, version?: number) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onsuccess = () => {
                const db = request.result
                const transaction = db.transaction(store, 'readwrite')
                const objectStore = transaction.objectStore(store)

                if (!Array.isArray(object)) object = [object]
                const addedObjects: IDBRequest[] = object.map((o: any) => objectStore.add(o))

                transaction.oncomplete = () => {
                    const insertedIds = addedObjects.map(r => r.result)
                    db.close()

                    resolve(object.length === 1 ? object[0] : object)
                }
                transaction.onerror = (err) => {
                    db.close()
                    reject(err)
                }
            }
            request.onerror = (err) => {
                console.log('idb save', err)
                reject(err)
            }
        })
    },
    async clear(store: string, version?: number) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onsuccess = () => {
                const db = request.result
                const transaction = db.transaction(store, 'readwrite')
                const otransaction = transaction.objectStore(store)
                const clearRequest = otransaction.clear()
                clearRequest.onsuccess = () => {
                    db.close()
                    resolve(true)
                }
                clearRequest.onerror = (err) => {
                    db.close()
                    reject(err)
                }
            }
            request.onerror = (err) => {
                return reject(err)
            }
        })
    },
    async byId<T>(store: string, id: any, version?: number): Promise<T | null> {

        if (id === undefined) {
            return null
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)

            request.onsuccess = (event) => {
                const db = (event.target as IDBOpenDBRequest).result
                const transaction = db.transaction([store], 'readonly')
                const objectStore = transaction.objectStore(store)
                const reader = objectStore.get(id)

                reader.onsuccess = (e: any) => {
                    const result = e.target.result

                    db.close()
                    resolve(result)
                }

                reader.onerror = (err: any) => {
                    db.close()
                    reject(err)
                }
            }

            request.onerror = (err) => {
                reject(err)
            }
        })
    },
    find<T>(store: string, options?: IGetAllOptions<T>) {
        const { skip = 0, limit = 1000 } = options || {}
        const filterFn = (record: any) => {
            // Adjust filtering as needed. If your records have an 'id' and not '_id', use 'id':
            if (options?.filter !== undefined) {
                return record.id && record.id.toString().includes(options.filter)
            }
            return true
        }

        return new Promise<T[]>((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (e: Event) => {
                const db = (e.target as IDBOpenDBRequest).result
                if (!db.objectStoreNames.contains(store)) {
                    db.close()
                    return resolve([])
                }

                let results: T[] = []
                let hasSkipped = false
                const transaction = db.transaction([store], 'readonly')
                const os = transaction.objectStore(store)
                let cursorRequest: IDBRequest<IDBCursorWithValue | null>

                let keyRng: IDBKeyRange | undefined
                if (options?.index) {
                    const index = os.index(options.index as string)

                    if (options?.value !== undefined) {
                        // Handle date ranges if needed
                        if (options.value instanceof Date) {
                            const startDate = new Date(options.value)
                            startDate.setHours(0, 0, 0, 0)
                            const endDate = new Date(startDate)
                            endDate.setHours(23, 59, 59, 999)

                            if (options.upperBound && options.lowerBound) {
                                const lowerBound = new Date(options.lowerBound)
                                lowerBound.setHours(0, 0, 0, 0)
                                const upperBound = new Date(options.upperBound)
                                upperBound.setHours(23, 59, 59, 999)
                                keyRng = IDBKeyRange.bound(lowerBound, upperBound, options.openLowerBound, options.openUpperBound)
                            } else if (options.upperBound) {
                                const upperBound = new Date(options.upperBound)
                                upperBound.setHours(23, 59, 59, 999)
                                keyRng = IDBKeyRange.upperBound(upperBound, options.openUpperBound)
                            } else if (options.lowerBound) {
                                const lowerBound = new Date(options.lowerBound)
                                lowerBound.setHours(0, 0, 0, 0)
                                keyRng = IDBKeyRange.lowerBound(lowerBound, options.openLowerBound)
                            } else {
                                keyRng = IDBKeyRange.bound(startDate, endDate)
                            }
                        } else {
                            // Non-date values
                            if (options.upperBound && options.lowerBound) {
                                keyRng = IDBKeyRange.bound(options.lowerBound, options.upperBound, options.openLowerBound, options.openUpperBound)
                            } else if (options.upperBound) {
                                keyRng = IDBKeyRange.upperBound(options.upperBound, options.openUpperBound)
                            } else if (options.lowerBound) {
                                keyRng = IDBKeyRange.lowerBound(options.lowerBound, options.openLowerBound)
                            } else {
                                keyRng = IDBKeyRange.only(options.value)
                            }
                        }
                    }
                    cursorRequest = index.openCursor(keyRng, options?.reverse ? 'prev' : 'next')
                } else {
                    cursorRequest = os.openCursor(null, options?.reverse ? 'prev' : 'next')
                }

                cursorRequest.onsuccess = (event: any) => {
                    const cursor = event.target.result
                    if (cursor && !hasSkipped && skip > 0) {
                        hasSkipped = true
                        cursor.advance(skip)
                    } else if (cursor) {
                        if (filterFn(cursor.value)) {
                            results.push(cursor.value)
                        }
                        if (results.length < limit) {
                            cursor.continue()
                        } else {
                            db.close()
                            return resolve(results)
                        }
                    } else {
                        db.close()
                        return resolve(results)
                    }
                }
                transaction.onerror = (err) => {
                    db.close()
                    return reject(err)
                }
            }
            request.onerror = (err) => {
                return reject(err)
            }
        })
    },
    all<T>(store: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (event: Event) => {
                const db = (event.target as IDBOpenDBRequest).result
                if (!db.objectStoreNames.contains(store)) {
                    db.close()
                    return resolve([])
                }
                const transaction = db.transaction(store, "readonly")
                const objectStore = transaction.objectStore(store)

                const getAllRequest = objectStore.getAll()

                getAllRequest.onsuccess = () => {
                    const results = getAllRequest.result
                    db.close()
                    resolve(results)
                }

                getAllRequest.onerror = () => {
                    db.close()
                    reject(getAllRequest.error)
                }

                transaction.onerror = () => {
                    db.close()
                    reject(transaction.error)
                }
            }

            request.onerror = () => {
                reject(request.error)
            }
        })
    },
    async count(store: string) {
        await waitUntilDbIsReady()
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (e) => {
                const db = request.result
                if (!db.objectStoreNames.contains(store)) {
                    db.close()
                    return resolve(0)
                }
                const transaction = db.transaction([store], 'readonly')
                const objectStore = transaction.objectStore(store)
                const countRequest = objectStore.count()
                countRequest.onsuccess = () => {
                    const count = countRequest.result
                    db.close()
                    resolve(count)
                }
                countRequest.onerror = (err) => {
                    db.close()
                    reject(err)
                }
            }
            request.onerror = (err) => {
                reject(err)
            }
        })
    },
    delete(store: string, id: any, version = 1) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onsuccess = (e) => {
                const db = request.result
                if (!db.objectStoreNames.contains(store)) {
                    db.close()
                    return resolve(true)
                }
                const transaction = db.transaction([store], 'readwrite')
                const objectStore = transaction.objectStore(store)
                const deleteRequest = objectStore.delete(id)
                deleteRequest.onsuccess = () => {
                    db.close()
                    resolve(true)
                }
                deleteRequest.onerror = (err) => {
                    db.close()
                    reject(err)
                }
            }
            request.onerror = (err) => {
                console.log('idb delete', err)
                reject(err)
            }
        })
    },
    update(store: string, id: string | number, payload: any) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = () => {
                const db = request.result
                if (!db.objectStoreNames.contains(store)) {
                    db.close()
                    return reject(new Error(`Store ${store} does not exist.`))
                }
                const transaction = db.transaction([store], 'readwrite')
                const objectStore = transaction.objectStore(store)
                const reader = objectStore.get(id)
                reader.onerror = (err) => {
                    db.close()
                    reject(err)
                }
                reader.onsuccess = () => {
                    const record = reader.result
                    if (!record) {
                        db.close()
                        return reject(new Error(`Record with id ${id} not found.`))
                    }
                    // Merge the record with the payload
                    const updateRequest = objectStore.put(payload)
                    updateRequest.onsuccess = () => {
                        db.close()
                        resolve(true)
                    }
                    updateRequest.onerror = (err) => {
                        db.close()
                        reject(err)
                    }
                }
            }
            request.onerror = (err) => {
                reject(err)
            }
        })
    }
})
