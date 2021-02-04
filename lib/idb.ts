interface IGetAllOptions {
    skip: number
    limit: number
    index?: string // comma separated
    value?: any // comma separated
    reverse?: boolean,
    upperBound?: any,
    lowerBound?: any
}

export default {
    // static db: IDBDatabase // Todo: multiple dbs

    getnfo(dbName: string, version?: number) {
        return new Promise<{ objectStoreNames: DOMStringList, version: number }>((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onsuccess = () => {
                const { objectStoreNames, version } = request.result
                request.result.close()
                return resolve({ objectStoreNames, version })
            }
            request.onupgradeneeded = () => {
                const { objectStoreNames, version } = request.result
                request.result.close()
                return resolve({ objectStoreNames, version })
            }
            request.onerror = error => reject(error)
        })
    },
    createStore(dbName: string, name: string, version: number, options?: { keyPath: string, autoIncrement?: boolean, indices?: string[] }) {
        const opts = { keyPath: 'id', autoIncrement: true, indices: [], ...options }
        // keyPath = 'id', autoIncrement = true
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onupgradeneeded = (event) => {
                const db = event?.target?.result
                const { objectStoreNames } = db
                if (!Object.values(objectStoreNames).includes(name)) {
                    const { keyPath, autoIncrement } = opts
                    const os = db.createObjectStore(name, { keyPath, autoIncrement })
                    opts.indices.forEach(index => os.createIndex(index, index, { unique: false }))
                }
                db.close()
                return resolve(event)
            }
            request.onsuccess = (event: any) => {
                request.result.close()
                return resolve(event)
            }
            request.onerror = error => reject(error)
        })
    },
    createindex(dbName: string, _store: string, version: number, index: string, options?: { unique?: boolean, multiEntry?: boolean }) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onupgradeneeded = (event) => {
                const db = event?.target?.result
                const upgradeTransaction = event?.target?.transaction
                const os = upgradeTransaction.objectStore(_store)
                
                if (!os.indexNames.contains(index)) {
                    os.createIndex(index, index, { unique: options?.unique || false, multiEntry: options?.multiEntry || false })
                }
                db.close()
                return resolve(event)
            }
            request.onsuccess = (event: any) => {
                request.result.close()
                return resolve(event)
            }
            request.onerror = error => reject(error)
        })
    },
    async save(dbName: string, store: string, object: any, version?: number) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onsuccess = () => {
                const transaction = request.result.transaction(store, 'readwrite').objectStore(store).add(object)
                transaction.onsuccess = (successEvent: Event) => {
                    request.result.close()
                    return resolve(successEvent?.target?.result)
                }
                transaction.onerror = (err) => {
                    return reject(err)
                }
            }
            request.onerror = (err) => {
                return reject(err)
            }
        })
    },
    async get(dbName: string, store: string, id: any, version?: number) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onsuccess = () => {
                const reader = request.result.transaction([store]).objectStore(store).get(id)
                reader.onerror = (err) => {
                    return reject(err)
                }
                reader.onsuccess = (e: any) => {
                    if (request.result) {
                        return resolve(e.target.result)
                    } else {
                        return resolve(null)
                    }
                }
            }
            request.onerror = (err) => {
                return reject(err)
            }
        })
    },
    // Count
    all(dbName: string, store: string, version?: number, options?: IGetAllOptions) {
        const { skip = 0, limit = 0 } = options || {}
        return new Promise<any[]>((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (e: Event | any) => {
                let results: any[] = []
                let hasSkipped = false
                const transaction = request.result.transaction([store], 'readonly')
                const os = transaction.objectStore(store)

                let cursorRequest: IDBRequest<IDBCursorWithValue | null>

                if (options?.index) {
                    const index = os.index(options.index)
                    // const cr = index.count(options?.value)
                    // cr.onsuccess = (f) => console.log(store, options, cr.result)
                    let keyRng = null
                    if (options?.value) {
                        keyRng = options.upperBound ? IDBKeyRange.upperBound(options.value) : IDBKeyRange.only(options.value)
                    }
                    
                    cursorRequest = index.openCursor(keyRng, options.reverse ? 'prev' : 'next')
                } else {
                    cursorRequest = os.openCursor(null, options?.reverse ? 'prev' : 'next') //nextunique
                }
                cursorRequest.onsuccess = (event: any) => {
                    const cursor = event.target.result
                    if (cursor && !hasSkipped && skip > 0) {
                        hasSkipped = true
                        cursor.advance(skip)
                        return
                    }
                    if (cursor) {
                        results.push(cursor.value)
                        if (results.length < limit) {
                            cursor.continue()
                        } else {
                            return resolve(results)
                        }
                    }
                    else {
                        request.result.close()
                        return resolve(results)
                    }
                }
                transaction.onerror = (err) => {
                    return reject(err)
                }
            }
            request.onerror = (err) => {
                return reject(err)
            }
        })
    },
    count() { },

    delete(dbName: string, store: any, id: any, version = 1) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (e) => {
                const transaction = request.result.transaction([store], 'readwrite')
                const objectStore = transaction.objectStore(store)
                objectStore.delete(id)
                return resolve(true)
            }
            request.onerror = (err) => {
                return reject(err)
            }
        })
    },
    update(dbName: string, store: any, payload: any, version = 1) {
        console.log('UPDATE', payload)

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (e) => {
                const transaction = request.result.transaction([store], 'readwrite')
                const objectStore = transaction.objectStore(store)
                const reader = objectStore.get(payload.id)
                reader.onerror = (err) => {
                    return reject(err)
                }
                reader.onsuccess = () => {
                    var updateTitleRequest = objectStore.put(payload)
                    updateTitleRequest.onsuccess = () => {
                        request.result.close()
                        return resolve(true)
                    }
                }
            }
            request.onerror = (err) => {
                return reject(err)
            }
        })
    }
}


