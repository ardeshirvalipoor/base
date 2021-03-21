export default <T>() => {
    const listeners: any = {}

    function on(event: T, handler: Function) {
        if (!listeners[event]) listeners[event] = []
        listeners[event].push(handler)
    }

    function once(eventName: T, listener: Function) {
        const onceFunction = (...args: any) => {
            off(eventName, onceFunction)
            listener(...args)
        }
        on(eventName, onceFunction)
    }

    function off(event: T, handler: Function) {
        listeners[event] = (listeners[event] || []).filter((e: any) => e !== handler)
        // console.log('off', { listeners })
    }

    function emit(event: T, ...params: any) {
        (listeners[event] || []).map((e: any) => e(...params))
    }

    return {
        on,
        once,
        off,
        emit
    }
}