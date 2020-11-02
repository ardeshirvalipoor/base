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
    createStore(dbName: string, name: string, keyPath = 'id', autoIncrement = true, version?: number) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onupgradeneeded = (event: any) => {
                const { objectStoreNames, version } = request.result
                if (!Object.values(objectStoreNames).includes(name)) {
                    request.result.createObjectStore(name, { keyPath, autoIncrement })
                }
                request.result.close()
                return resolve(event)
            }
            request.onsuccess = (event: any) => {
                request.result.close()
                return resolve(event)
            }
            request.onerror = error => reject(error)
        })
    },
    async add(dbName: string, store: string, object: any, version?: number) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onsuccess = () => {
                const transaction = request.result.transaction(store, 'readwrite').objectStore(store).add(object)
                transaction.onsuccess = (successEvent: Event) => {
                    request.result.close()
                    return resolve(successEvent)
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
    async byId(dbName: string, store: string, id: any, version = 1) {
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
    readAll(dbName: string, store: string, version = 1) {
        return new Promise<any[]>((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (e: Event | any) => {
                let results: any[] = []
                const transaction = request.result.transaction([store], 'readonly')
                transaction.objectStore(store).openCursor().onsuccess = (event: any) => {
                    const cursor = event.target.result
                    if (cursor) {
                        results.push(cursor.value)
                        cursor.continue()
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
    query() { },

  /*   remove(store: string, id: string | number | Date | ArrayBufferView | ArrayBuffer | IDBArrayKey | IDBKeyRange) {

        var request = IndexedDB.db.transaction([store], 'readwrite')
            .objectStore(store)
            .delete(id)
        request.onsuccess = function (event) {
            alert('Kenny\'s entry has been removed from your database.')
        }
    } */update(dbName: string, store: any, payload: any, version = 1) {
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


