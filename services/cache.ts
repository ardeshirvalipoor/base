let cache: any = {}
let expirationTimes: any = {}

function set(key: string, value: any, ttl: number = 300 * 1000) {
    cache[key] = value
    expirationTimes.set(key, Date.now() + ttl)
}

function get(key: string) {
    const expirationTime = expirationTimes[key]
    if (expirationTime && expirationTime < Date.now()) {
        delete cache[key]
        delete expirationTimes[key]
        return undefined
    }
    return cache[key]
}

function clear() {
    cache = {}
    expirationTimes = {}
}

function keys() {
    return Object.keys(cache)
}

export default {
    set,
    get,
    clear,
    keys
}