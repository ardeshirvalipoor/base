import { EVENTS } from '../helpers/events'

export const createEmitter = () => {
    let _listeners: { [key: string]: Function[] } = {}

    // interface EMap {
    //     "key": CustomEvent;
    // on<K extends keyof EMap>(type: K, listener: (this: Native, ev: EMap[K]) => any, options?: boolean | AddEventListenerOptions): void;

    function on(event: string | string[], ...handlers: Function[]) {
        if (!Array.isArray(event)) event = [event]
        event.map(e => {
            if (!_listeners[e]) _listeners[e] = []
            _listeners[e].push(...handlers)
        })
        return this
    }

    function once(event: string, handler: Function) {
        const onceFunction = (...args: any) => { // anyodo: not working
            handler(...args)
            off(event, onceFunction)
        }
        on(event, onceFunction)
        return this
    }

    function off(event: string, handler: Function) {
        _listeners[event] = (_listeners[event] || []).filter((e: any) => e !== handler)
        return this
    }

    function emit(event: string, ...params: any) {
        if (_listeners[event]) {
            (_listeners[event] || []).forEach((e: any) => e(...params))
        }
        
        // Wildcard events
        if (_listeners['*']) {
            _listeners['*'].forEach((e: any) => e(event, ...params))
        }
        
        return this
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

// Singleton global emitter
export default createEmitter()

export interface IEmitter {
    on: (e: string | string[], ...handlers: Function[]) => IEmitter
    once: (e: string, handler: Function) => IEmitter
    off: (e: string, handler: Function) => IEmitter
    emit: (e: string, ...args: any) => IEmitter
    removeAllListeners: () => void
}
