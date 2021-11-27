import { IXHROptoins, XHR } from "./xhr"

let _cache: any = {}
let _queue: any = {}

const queuer = async (key: string, url: string, options: IXHROptoins = {}, cb: Function) => {
    if (!_queue[key]) {
        XHR.get(url, options).then(online => {
            _cache[key] = online
            _queue[key].map((cb: Function) => cb(_cache[key]))
            delete _queue[key]
        })
        _queue[key] = []
    }
    _queue[key].push(cb)
}

/* 
Fetch is used to queue requests... sometimes to a single url there are many duplicated requests
*/
export const fetch = <T>(key: string, url: string = key, options: IXHROptoins) => {
    return new Promise<T | null>(async (resolve, reject) => {
        try {
            if (_cache[key]) return resolve(_cache[key])
            queuer(key, url, options, (r: T) => resolve(r))
        } catch (error) {
            console.log(key, url, error)
            return resolve(null)
        }
    })
}
