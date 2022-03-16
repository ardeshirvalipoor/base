const _XHRCache: any = {}
const get = (url: string, options: IXHROptoins = {}) => {
    const opts = { method: 'GET', type: 'application/json', cache: 0, ...options }
    return new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest
        xhr.open(opts.method, url, true)
        xhr.setRequestHeader('Content-Type', opts.type)
        if (opts.auth) xhr.setRequestHeader('Authorization', 'Bearer ' + opts.auth)
        // xhr.onerror = (err) => alert(JSON.stringify({ err, m: 'x' }))

        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                try {
                    return resolve(
                        // status: xhr.status, //others
                        // // data: 
                        // ...
                        opts.type == 'application/json' ? JSON.parse(xhr.response) : xhr.response
                        // JSON.parse(xhr.response)
                    )
                } catch (error) {
                    // console.warn(error)
                    return resolve({
                        status: xhr.status,
                        data: xhr.response
                    })
                }
            }
        }
        xhr.send()
    })
}

const post = (url: string, body?: any, _headers: any = {}) => {
    const headers = { 'Content-Type': 'application/json', cache: 0, ..._headers }
    
    return new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest
        xhr.open('POST', url, true)

        Object.keys(headers).map(key => {
            xhr.setRequestHeader(key, headers[key])
        }) // Todo: fix it
        if (headers.auth) xhr.setRequestHeader('Authorization', 'Bearer ' + headers.auth)
        // xhr.send(headers['Content-Type'] === 'application/json' ? JSON.stringify(body) : body)
        xhr.send(body ? JSON.stringify(body) : null)
        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                try {
                    return resolve(
                        headers.type == 'application/json' ? JSON.parse(xhr.response) : xhr.response
                    )
                } catch (error) {
                    // console.warn(error)
                    return resolve({
                        status: xhr.status,
                        data: xhr.response
                    })
                }
            }
        }
    })
}


const put = (url: string, body?: any, _headers: any = {}) => {
    const headers = { type: 'application/json', cache: 0, ..._headers }
    return new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest
        xhr.open('PUT', url, true)
        Object.keys(headers).map(key => {
            xhr.setRequestHeader(key, headers[key])
        }) // Todo: fix it
        xhr.setRequestHeader('Content-Type', headers.type)
        xhr.setRequestHeader('Authorization', 'Bearer ' + headers.auth)
        // xhr.send(headers['Content-Type'] === 'application/json' ? JSON.stringify(body) : body)
        xhr.send(JSON.stringify(body))
        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                try {
                    return resolve({
                        status: xhr.status, //others
                        // data: opts.type == 'application/json' ? JSON.parse(xhr.response) : xhr.response */
                        ...JSON.parse(xhr.response)
                    })
                } catch (error) {
                    // console.warn(error)
                    return resolve({
                        status: xhr.status,
                        data: xhr.response
                    })
                }
            }
        }
    })
}

const remove = (url: string, _headers: any = {}) => {
    const headers = { type: 'application/json', cache: 0, ..._headers }
    return new Promise<any>((resolve, reject) => {
        const xhr = new XMLHttpRequest
        xhr.open('DELETE', url, true)
        Object.keys(headers).map(key => {
            xhr.setRequestHeader(key, headers[key])
        }) // Todo: fix it
        xhr.setRequestHeader('Content-Type', headers.type)
        xhr.setRequestHeader('Authorization', 'Bearer ' + headers.auth)
        // xhr.send(headers['Content-Type'] === 'application/json' ? JSON.stringify(body) : body)
        xhr.send()
        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                try {
                    return resolve({
                        status: xhr.status, //others
                        // data: opts.type == 'application/json' ? JSON.parse(xhr.response) : xhr.response */
                        ...JSON.parse(xhr.response)
                    })
                } catch (error) {
                    // console.warn(error)
                    return resolve({
                        status: xhr.status,
                        data: xhr.response
                    })
                }
            }
        }
    })
}

const uploader = (file: File | string, url: string) => {
    return {
        start() {
            const xhr = new XMLHttpRequest
            xhr.open('POST', url)
            const name = typeof file === 'string' ? 'profile.jpg' : file.name
            const type = typeof file === 'string' ? 'image/jpg' : file.type || 'image/jpg'
            xhr.setRequestHeader('File-Type', type || 'image/jpg')
            xhr.setRequestHeader('File-Name', encodeURIComponent(name) || 'test.jpg')
            xhr.onload = () => xhr.status === 200 || xhr.status === 201 ? this.done(xhr) : this.failed(xhr)
            xhr.onerror = e => this.failed(e)
            xhr.upload.onprogress = e => this.onProgress(e)
            xhr.upload.onerror = e => console.log('xhr.upload.onerror', e)
            xhr.upload.onload = e => console.log('xhr.upload.load', e)
            xhr.upload.onloadend = e => console.log('xhr.upload.onloadend doesn\'t mean it\'s =done. it\'s just uploaded', e)
            xhr.upload.onloadstart = e => console.log('xhr.upload.onloadstart', e)
            xhr.send(file)
        },
        onProgress(value: ProgressEvent<EventTarget>) { },
        done(response: any) { },
        failed(response: any) { }
    }

}

export const XHR = {
    get,
    post,
    delete: remove,
    put, // Todo make merge
    uploader
}



export interface IXHROptoins {
    method?: string,
    type?: string,
    cache?: number,
    auth?: string
}

//  xhr.readyState
//  0	UNSENT	           Client has been created.open() not called yet.
//  1	OPENED	           open() has been called.
//  2	HEADERS_RECEIVED   send() has been called, and headers and status are available.
//  3	LOADING	           Downloading; responseText holds partial data.
//  4	DONE	           The operation is complete.