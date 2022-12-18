let __state: any = {}

function get(key: string, defaultValue = {}) {
    return __state[key] || defaultValue
}

function set(key: string, value: any) {
    __state[key] = value
}

function merge(key: string, value: any) {
    __state[key] = { ...__state[key], ...value }
}

function use(key: string, defaultValue = {}): IUseState {
    if (!__state[key]) __state[key] = defaultValue
    return [
        () => __state[key], // get
        (value: any) => __state[key] = value, // set
        (value: any) => __state[key] = { ...__state[key], ...value } // merge
        // Todo: handle nested merge (deep merge), example: { 'a.b.c.d': value }
    ]
}

export default {
    get,
    set,
    merge,
    use,
}

type IUseState = [() => any, (value: any) => void, (value: any) => void]
