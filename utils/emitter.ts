export const emitter = () => {
    const listeners: any = {}
    function off(event: string, handler: Function) {
        listeners[event] = (listeners[event] || []).filter((e: any) => e !== handler)
        // console.log('off', { listeners })
    }
    function on(event: string, handler: Function) {
        if (!listeners[event]) {
            listeners[event] = []
        }
        listeners[event].push(handler)
    }
    return {
        on,
        once(eventName: string, listener: Function) {
            const onceFunction = (...args: any) => {
                off(eventName, onceFunction)
                listener(...args)
            }
            on(eventName, onceFunction)
        },
        off,
        emit(event: string, ...params: any) {
            (listeners[event] || []).map((e: any) => e(...params))
        }
    }
}

export default emitter()