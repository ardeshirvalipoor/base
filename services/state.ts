let __state: any = {}

function get<T>(key: string, defaultValue = {} as T): T {
    return __state[key]
}

function set<T>(key: string, value: Partial<T>) {
    __state[key] = value
}

function merge<T>(key: string, value: Partial<T>) {
    __state[key] = { ...__state[key], ...value }
}

function use<T>(key: string, defaultValue?: any): IUseState<T> {
    if (__state[key] === undefined) __state[key] = defaultValue
    return [
        () => __state[key],
        (value) => __state[key] = value,
        (value) => __state[key] = { ...__state[key], ...value }
        // Todo: handle nested merge (deep merge), example: { 'a.b.c.d': value }
    ]
}

export default {
    get,
    set,
    merge,
    use,
}

type IUseState<T> = [() => T, (value: T) => void, (value: T) => void]
