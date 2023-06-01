import { IEmitter, createEmitter } from '../utils/emitter'

let __store: any = createEmitter()

function get<T = any>(key: string): T {
    return __store[key]
}

function set(key: string, value: any) {
    __store[key] = value
    __store.emit(key, value)
}

function merge(key: string, value: any) {
    __store[key] = { ...__store[key], ...value }
    __store.emit(key, __store[key])
}

__store.get = get
__store.set = set
__store.merge = merge

const store: IStore<any> = __store

export default store

interface IStore<T> extends IEmitter {
    get<T = any>(key: string): T;
    set: (key: string, value: T) => void
    merge: (key: string, value: Partial<T>) => void
}