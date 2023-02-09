import { EVENTS } from '../helpers/events'

export const _emitter = () => {
    let _listeners: any = {}

    function on(event: string | string[], ...handlers: Function[]) {
        if (!Array.isArray(event)) event = [event]
        event.map(e => {
            if (!_listeners[e]) _listeners[e] = []
            _listeners[e].push(...handlers)
        })
    }

    function once(event: string, handler: Function) {
        const onceFunction = (...args: any) => { // anyodo: not working
            handler(...args)
            off(event, onceFunction)
        }
        on(event, onceFunction)
    }

    function off(event: string, handler: Function) {
        _listeners[event] = (_listeners[event] || []).filter((e: any) => e !== handler)
    }

    function emit(event: string, ...params: any) {
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

export default _emitter()

export interface IEmitter {
    on: (e: string | string[], ...handlers: Function[]) => void
    once: (e: string, handler: Function) => void
    off: (e: string, handler: Function) => void
    emit: (e: string, ...args: any) => void
    removeAllListeners: () => void
}