const _emitter = <T>() => {
    const listeners: any = {}

    function on(event: T, handler: Function) {
        if (!listeners[event]) listeners[event] = []
        listeners[event].push(handler)
    }
    function solo(event: T, handler: Function) {
        listeners[event] = [handler]
    }

    function once(event: T, handler: Function) {
        // const possibleEvent = (listeners[event] || []).find((e: any) => e === handler)
        // console.log('possibleEvent', possibleEvent)
        // if (possibleEvent) return
        // on(event, handler)

        const onceFunction = (...args: any) => {
            handler(...args)
            off(event, onceFunction)
        }
        on(event, onceFunction)
    }

    function off(event: T, handler: Function) {
        listeners[event] = (listeners[event] || []).filter((e: any) => e !== handler)
        // console.log('off', { listeners })
    }

    function emit(event: T, ...params: any) {
        (listeners[event] || []).map((e: any) => e(...params))
        // (listeners[event] || []).forEach((handler: any) => handler.apply(this, params)); // Check this?
        // Only needed when there is a use of this?
    }


    return {
        on,
        solo, // Todo: :))
        once,
        off,
        emit,
        listeners
    }
}
export default _emitter
export const globalEmitter = _emitter()
