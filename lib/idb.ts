import { emitter } from "../utils/emitter"

interface IGetAllOptions {
    skip?: number
    limit?: number
    index?: string // comma separated
    filter?: string // comma separated
    value?: any // comma separated
    reverse?: boolean,
    upperBound?: any,
    lowerBound?: any,
    openUpperBound?: boolean,
    openLowerBound?: boolean,
}

let dbIsReady = false

let dbReadyPromise: Promise<boolean> = new Promise((resolve, reject) => {
    emitter.on('db-ready', () => {
        dbIsReady = true;
        resolve(true);
    })
})

function waitUntilDbIsReady(): Promise<boolean> {
    return dbReadyPromise;
}

export default (dbName: string) => ({
    info(version?: number) {
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
    createStore(name: string, version: number, options?: { keyPath: string, autoIncrement?: boolean, indices?: string[] }) {
        const opts = { keyPath: 'id', autoIncrement: true, indices: [], ...options };
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            request.onupgradeneeded = (event) => {
                const db = (event.target as any).result;
                const { keyPath, autoIncrement } = opts;
                const os = db.createObjectStore(name, { keyPath, autoIncrement });
                opts.indices.forEach(index => os.createIndex(index, index, { unique: false }));
            };

            request.onsuccess = (event) => {
                event?.target && (event.target as any).result.close();
                resolve(event);
            };

            request.onerror = (error) => {
                reject(error);
            };
        });
    },
    createindex(_store: string, version: number, index: string, options?: { unique?: boolean, multiEntry?: boolean }) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onupgradeneeded = (event) => {
                const target = event.target as any // Todo: take a look at this
                const db = target.result /* request.result */
                const upgradeTransaction = target.transaction // db.transaction(_store, 'readwrite')
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
    async save(store: string, object: any, version?: number) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onsuccess = () => {
                const transaction = request.result.transaction(store, 'readwrite')
                const objectStore = transaction.objectStore(store)
                if (!Array.isArray(object)) object = [object]
                const addedObjects: IDBRequest[] = object.map((o: any) => {
                    return objectStore.add(o)
                })
                transaction.oncomplete = (successEvent) => {
                    request.result.close()
                    const insertedIds = addedObjects.map(r => r.result)
                    resolve(insertedIds.length === 1 ? insertedIds[0] : insertedIds)
                }
                transaction.onerror = (err) => {
                    reject(err)
                }
            }
            request.onerror = (err) => {
                reject(err)
            }
        })
    },
    async clear(store: string, version?: number) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onsuccess = () => {
                const otransaction = request.result.transaction(store, 'readwrite').objectStore(store)
                otransaction.clear()
                return resolve(true)
            }
            request.onerror = (err) => {
                console.log('clear', err)
                return reject(err)
            }
        })
    },
    async byId(store: string, id: any, version?: number) {

        if (id === undefined) {
            return null;
        }

        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version);

            request.onsuccess = (event) => {
                const db = event && (event.target as any).result;
                const transaction = db.transaction([store], 'readonly');
                const objectStore = transaction.objectStore(store);
                const reader = objectStore.get(id);

                reader.onsuccess = (e: any) => {
                    db.close();
                    resolve(e.target.result);
                };

                reader.onerror = (err: any) => {
                    db.close();
                    reject(err);
                };
            };

            request.onerror = (err) => {
                reject(err);
            };
        });
    },
    find(store: string, options?: IGetAllOptions) {
        // Todo: multople index
        const { skip = 0, limit = 1000 } = options || {}
        const filter = (record: any) => {
            if (options?.filter !== undefined) {
                return record._id.includes(options.filter)
            }
            return true
        }
        return new Promise<any[]>((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (e: Event | any) => {
                // console.log('on success', store)

                let results: any[] = []
                let hasSkipped = false
                if (!request.result.objectStoreNames.contains(store)) {
                    return resolve([])
                }
                const transaction = request.result.transaction([store], 'readonly')
                const os = transaction.objectStore(store)
                let cursorRequest: IDBRequest<IDBCursorWithValue | null>
                // console.log(options);

                if (options?.index) {
                    const index = os.index(options.index)
                    // console.log('index', index);

                    // const cr = index.count(options?.value)
                    // cr.onsuccess = (f) => console.log(store, options, cr.result)
                    let keyRng;

                    if (options?.value !== undefined) {
                        // Check if the value is a Date object
                        if (options.value instanceof Date) {
                            // Normalize the date to the start of the day (midnight)
                            const startDate = new Date(options.value);
                            startDate.setHours(0, 0, 0, 0);

                            // Set the end date to just before midnight of the next day
                            const endDate = new Date(startDate);
                            endDate.setHours(23, 59, 59, 999);

                            if (options.upperBound && options.lowerBound) {
                                // For a specific date range (between lowerBound and upperBound)
                                const lowerBound = new Date(options.lowerBound);
                                const upperBound = new Date(options.upperBound);

                                lowerBound.setHours(0, 0, 0, 0);  // Normalize lower bound to start of day
                                upperBound.setHours(23, 59, 59, 999);  // Normalize upper bound to end of day

                                keyRng = IDBKeyRange.bound(lowerBound, upperBound, options.openLowerBound, options.openUpperBound);
                            } else if (options.upperBound) {
                                // For upper bound only (ignoring time)
                                const upperBound = new Date(options.upperBound);
                                upperBound.setHours(23, 59, 59, 999);
                                keyRng = IDBKeyRange.upperBound(upperBound, options.openUpperBound);
                            } else if (options.lowerBound) {
                                // For lower bound only (ignoring time)
                                const lowerBound = new Date(options.lowerBound);
                                lowerBound.setHours(0, 0, 0, 0);
                                keyRng = IDBKeyRange.lowerBound(lowerBound, options.openLowerBound);
                            } else {
                                // For a specific date (exact match, ignoring time)
                                keyRng = IDBKeyRange.bound(startDate, endDate);
                            }
                        } else {
                            // If the value is not a Date object, use the existing logic
                            if (options.upperBound && options.lowerBound) {
                                // For a specific range between lowerBound and upperBound
                                keyRng = IDBKeyRange.bound(options.lowerBound, options.upperBound, options.openLowerBound, options.openUpperBound);
                            } else if (options.upperBound) {
                                // For upper bound only
                                keyRng = IDBKeyRange.upperBound(options.upperBound, options.openUpperBound);
                            } else if (options.lowerBound) {
                                // For lower bound only
                                keyRng = IDBKeyRange.lowerBound(options.lowerBound, options.openLowerBound);
                            } else {
                                // For a specific value (exact match)
                                keyRng = IDBKeyRange.only(options.value);
                            }
                        }
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
                    } else if (cursor) {
                        if (filter(cursor.value)) {
                            results.push(cursor.value)
                        }
                        if (results.length < limit) {
                            cursor.continue()
                        } else {
                            return resolve(results)
                        }
                    } else {
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
    all<T>(store: string): Promise<T[]> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName);
            request.onsuccess = (event: Event) => {
                const db = (event.target as IDBOpenDBRequest).result;
                const transaction = db.transaction(store, "readonly");
                const objectStore = transaction.objectStore(store);

                const getAllRequest = objectStore.getAll();

                getAllRequest.onsuccess = () => {
                    const results = getAllRequest.result;
                    db.close();
                    resolve(results);
                };

                getAllRequest.onerror = (event) => {
                    reject(getAllRequest.error);
                };

                transaction.oncomplete = () => {
                    db.close();
                };

                transaction.onerror = (event) => {
                    reject(transaction.error);
                };
            };

            request.onerror = (event) => {
                reject(request.error);
            };
        });
    },
    async count(store: any) {
        await waitUntilDbIsReady(dbName)
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (e) => {
                const transaction = request.result.transaction([store], 'readonly')
                const objectStore = transaction.objectStore(store)
                const countRequest = objectStore.count()
                countRequest.onsuccess = () => {
                    resolve(countRequest.result)
                }
                countRequest.onerror = (err) => {
                    reject(err)
                }
            }
            request.onerror = (err) => {
                reject(err)
            }
        })
    },
    delete(store: any, id: any, version = 1) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (e) => {
                const transaction = request.result.transaction([store], 'readwrite')
                const objectStore = transaction.objectStore(store)
                objectStore.delete(id)
                resolve(true)
            }
            request.onerror = (err) => {
                console.log('idb delete', err)
                reject(err)
            }
        })
    },
    update(store: any, id: string | number, payload: any, version = 1) {
        // or later by query like mongodb
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (e) => {
                const transaction = request.result.transaction([store], 'readwrite')
                const objectStore = transaction.objectStore(store)
                const reader = objectStore.get(id)
                reader.onerror = (err) => {
                    reject(err)
                }
                reader.onsuccess = () => {
                    var updateTitleRequest = objectStore.put(payload)
                    updateTitleRequest.onsuccess = () => {
                        request.result.close()
                        resolve(true)
                    }
                }
            }
            request.onerror = (err) => {
                reject(err)
            }
        })
    }
})


