import { IRouteParams } from "../lib/router"

export const createEmitter = <EMap extends BaseEventMap>() => {
    let _listeners: { [key in keyof EMap]?: Function[] } = {}

    function on<K extends keyof EMap>(event: K | K[], ...handlers: ((params: EMap[K]) => any)[]) {
        if (!Array.isArray(event)) event = [event]
        event.map(e => {
            _listeners[e] = _listeners[e] || []
            _listeners[e]?.push(...handlers) // TODO: remove ? later in the future versions of typescript
        })
        return this
    }

    function once<K extends keyof EMap>(event: K, handler: (params: EMap[K]) => any) {
        const onceFunction = (params: EMap[K]) => {
            handler(params)
            off(event, onceFunction)
        }
        on(event, onceFunction)
        return this
    }

    function off<K extends keyof EMap>(event: K, handler?: (params: EMap[K]) => any) {
        if (!handler) {
            delete _listeners[event]
            return this
        }
        _listeners[event] = (_listeners[event] || []).filter((e: any) => e !== handler)
        return this
    }

    function emit<K extends keyof EMap>(event: K, params?: EMap[K]) {
        if (_listeners[event]) {
            (_listeners[event] || []).forEach((e: any) => e(params))
        }
        return this
    }

    function removeAllListeners() {
        _listeners = {}
    }

    function getListeners() {
        return _listeners
    }

    return {
        on,
        once,
        off,
        emit,
        getListeners,
        removeAllListeners
    }
}

export const emitter = createEmitter<BaseEventMap>()
export interface IEmitter<EMap extends BaseEventMap> {
    // on<K extends keyof EMap>(event: K | K[], ...handlers: ((params: EMap[K]) => any)[]): IEmitter<EMap>
    once: (e: string, handler: Function) => IEmitter<any>
    off: (e: string, handler?: Function) => IEmitter<any>
    emit: (e: string, ...args: any) => IEmitter<any>
    on: (e: string | string[], ...handlers: Function[]) => IEmitter<any>
    // once<K extends keyof EMap>(event: K, handler: (params: EMap[K]) => any): IEmitter<EMap>
    // off<K extends keyof EMap>(event: K, handler?: (params: EMap[K]) => any): IEmitter<EMap>
    // emit<K extends keyof EMap>(event: K, params: EMap[K]): IEmitter<EMap>
    removeAllListeners: () => void
    getListeners: () => { [key: string]: Function[] }
}

export interface BaseEventMap {
    'enter': IRouteParams
    'exit': IRouteParams
    'item-selected': string
    'tab-selected': string
    'click': MouseEvent
    'mounted': void
    'db-ready': void
}

export type EVENTS =
    | 'click'
    | 'mouseover'
    | 'mouseenter'
    | 'mouseout'
    | 'mousedown'
    | 'mouseup'
    | 'mouseleave'
    | 'escape'
    | 'input'
    | 'blur'
    | 'hover'
    | 'focus'
    | 'change'
    | 'submit'
    | 'cancel'
    | 'delete'
    | 'appended'
    | 'resize'
    | 'mounted'
    | 'scroll'
    | 'scrollend'
    | 'removed'
    | 'tap'
    | 'touchstart'
    | 'touchend'
    | 'touchcancel'
    | 'touchmove'
    | 'node-added'
    | 'child-appended'
    | 'paste'
    | 'theme-changed'
