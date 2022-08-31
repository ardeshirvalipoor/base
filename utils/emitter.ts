import { EVENTS } from '../helpers/events'

// Todo: add custom event strings

export const _emitter = <T>() => {
    let _listeners: any = {}

    function on(event: string /* T */, handler: Function) {
        if (!_listeners[event]) _listeners[event] = []
        _listeners[event].push(handler)
    }

    function once(event: string/* T */, handler: Function) {
        const onceFunction = (...args: any) => { // Todo: not working
            handler(...args)
            off(event, onceFunction)
        }
        on(event, onceFunction)
    }

    function off(event:string /* T */, handler: Function) {
        _listeners[event] = (_listeners[event] || []).filter((e: any) => e !== handler)
    }

    function emit(event:string /* T */, ...params: any) {
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

export default _emitter<EVENTS>()

export interface IEmitter {
    on: (e: string, handler: Function) => void
    once: (e: string, handler: Function) => void
    off: (e: string, handler: Function) => void
    emit: (e: string, value?: any) => void
    removeAllListeners: () => void
}