import { IEmitter, createEmitter } from '../utils/emitter'

let __store: any = createEmitter()

function get<T = any>(key: string, fallback?: T): T {
    return __store[key] || fallback
}

function set(key: string, value: any) {
    __store[key] = value
    __store.emit(key, value)
}

function merge(key: string, value: any) {
    __store[key] = { ...__store[key], ...value }
    __store.emit(key, __store[key])
}

function keys() {
    return Object.keys(__store)
}

__store.get = get
__store.set = set
__store.merge = merge
__store.keys = keys

const store: IStore<any> = __store

export default store

interface IStore<T> extends IEmitter {
    get<T = any>(key: string, fallback?: T): T;
    set: (key: string, value: T) => void
    merge: (key: string, value: Partial<T>) => void
    keys: () => string[]
}