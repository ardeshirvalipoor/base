// import { DEFAULT_TTL } from "../../configs/ttl"
import { IXHROptoins, XHR } from "./xhr"

let _queue: any = {}

const queuer = async (key: string, url: string, options: IXHROptoins = {}, cb: Function) => {
    if (!_queue[key]) {
        _queue[key] = []
        const response = await XHR.get(url, options)
        _queue[key].map((cb: Function) => cb(response))
        delete _queue[key]
    }
    _queue[key].push(cb)
}

export const fetch = <T>(key: string, url: string = key, options: IXHROptoins = {}) => {
    return new Promise<T>(async (resolve, reject) => {
        try {
            queuer(key, url, options, (r: T) => resolve(r))
        } catch (error) {
            console.log(key, url, error)
            return reject(error)
        }
    })
}
