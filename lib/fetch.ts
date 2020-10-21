import { XHR } from '../self/lib/xhr'

let _cache: any = {}
let _queue: any = {}

const queuer = async (key: string, url: string, cb: Function) => {
    if (!_queue[key]) {
        XHR.get(url).then(online => {
            _cache[key] = online
            _queue[key].map((cb: Function) => cb(_cache[key]))
            delete _queue[key]
        })
        _queue[key] = []
    }
    _queue[key].push(cb)
}

export const fetch = <T>(key: string, url: string) => {
    return new Promise<T | null>(async (resolve, reject) => {
        try {
            if (_cache[key]) return resolve(_cache[key])
            queuer(key, url, (r: T) => resolve(r))
        } catch (error) {
            console.log(key, url, error)
            return resolve(null)
        }
    })
}