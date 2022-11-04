interface IGetAllOptions {
    skip?: number
    limit?: number
    index?: string // comma separated
    value?: any // comma separated
    reverse?: boolean,
    upperBound?: any,
    lowerBound?: any,
    openUpperBound?: boolean,
    openLowerBound?: boolean,
}

export default (dbName: string) => ({
    // static db: IDBDatabase // Todo: multiple dbs

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
        const opts = { keyPath: 'id', autoIncrement: true, indices: [], ...options }
        // keyPath = 'id', autoIncrement = true
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onupgradeneeded = (event) => {
                const db = request.result
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
    createindex(_store: string, version: number, index: string, options?: { unique?: boolean, multiEntry?: boolean }) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onupgradeneeded = (event) => {
                const db = request.result
                const upgradeTransaction = db.transaction(_store, 'readwrite')
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
                const transaction = request.result.transaction(store, 'readwrite').objectStore(store).add(object)
                transaction.onsuccess = (successEvent) => {
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
    async clear(store: string, version?: number) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName, version)
            request.onsuccess = () => {
                const otransaction = request.result.transaction(store, 'readwrite').objectStore(store)
                otransaction.clear()
            }
            request.onerror = (err) => {
                return reject(err)
            }
        })
    },
    // request.onsuccess = () => {
    //     const db = request.result;
    //     const transaction = db.transaction(['invoices'], 'readwrite');
    //     const invStore = transaction.objectStore('invoices');
    //     const vendorIndex = invStore.index('VendorIndex');
    //     const keyRng = IDBKeyRange.only('GE');
    //     const cursorRequest = vendorIndex.openCursor(keyRng);
    //     cursorRequest.onsuccess = e => {
    //         const cursor = e.target.result;
    //         if (cursor) {
    //             const invoice = cursor.value;
    //             invoice.vendor = 'P&GE';
    //             const updateRequest = cursor.update(invoice);

    //             cursor.continue();
    //         }
    //     }
    // };

    // request.onsuccess = () => {
    //     const db = request.result;
    //     const transaction = db.transaction(
    //         ['invoices', 'invoice-items'],
    //         'readwrite'
    //     );
    //     const invStore = transaction.objectStore('invoices');
    //     const invItemStore = transaction.objectStore('invoice-items');
    //     // Get invoice cursor
    //     const invoiceCursorRequest = invStore.index('VendorIndex')
    //         .openCursor(IDBKeyRange.only('Frigidaire'));
    //     invoiceCursorRequest.onsuccess = e => {
    //         const invCursor = e.target.result;
    //         if (invCursor) {
    //             // Get invoice item cursor
    //             const invItemCursorRequest = invItemStore
    //                 .index('InvoiceIndex')
    //                 .openCursor(
    //                     IDBKeyRange.only(invCursor.value.invoiceId)
    //                 );
    //             invItemCursorRequest.onsuccess = e => {
    //                 const invItemCursor = e.target.result;
    //                 if (invItemCursor) {
    //                     invItemCursor.delete();
    //                     invItemCursor.continue();
    //                 }
    //             }
    //             invCursor.delete();
    //             invCursor.continue();
    //         }
    //     }
    // };
    async byId(store: string, id: any, version?: number) {
        return new Promise((resolve, reject) => {
            if (id === undefined) { return resolve(null) }
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
    find(store: string, options?: IGetAllOptions) {
        const { skip = 0, limit = 1000 } = options || {}
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
                        keyRng =
                            options.upperBound ?
                                IDBKeyRange.upperBound(options.value, options.openUpperBound) :
                                options.lowerBound ?
                                    IDBKeyRange.lowerBound(options.value, options.openLowerBound) :
                                    IDBKeyRange.only(options.value)
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
    delete(store: any, id: any, version = 1) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(dbName)
            request.onsuccess = (e) => {
                const transaction = request.result.transaction([store], 'readwrite')
                const objectStore = transaction.objectStore(store)
                objectStore.delete(id)
                return resolve(true)
            }
            request.onerror = (err) => {
                console.log('idb delete', err)
                return reject(err)
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
})


