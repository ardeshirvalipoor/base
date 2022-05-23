export const emitter = <T>() => {
    let _listeners: any = {}

    function on(event: T, handler: Function) {
        if (!_listeners[event]) _listeners[event] = []
        _listeners[event].push(handler)
    }

    function once(event: T, handler: Function) {
        const onceFunction = (...args: any) => { // Todo: not working
            handler(...args)
            off(event, onceFunction)
        }
        on(event, onceFunction)
    }

    function off(event: T, handler: Function) {
        _listeners[event] = (_listeners[event] || []).filter((e: any) => e !== handler)
    }

    function emit(event: T, ...params: any) {
        (_listeners[event] || []).map((e: any) => e(...params))
    }

    function removeAllListeners() {
        _listeners = {}
    }

    return {
        on,
        once,
        off,
        emit,
        listeners: _listeners,
        removeAllListeners
    }
}

export default emitter()

export interface IEmitter {
    on: (e: string, handler: Function) => void
    once: (e: string, handler: Function) => void
    off: (e: string, handler: Function) => void
    emit: (e: string, value?: any) => void
    removeAllListeners: () => void
}