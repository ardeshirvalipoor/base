import { _emitter } from './emitter'

export function observe(el: HTMLElement)/* : Promise<HTMLElement[]> */ {
    const em = _emitter()
    let observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            mutation.addedNodes.forEach((node: HTMLElement) => {
                if (node instanceof HTMLElement) {
                    const id = node?.getAttribute('data-base-id')
                    em.emit('mutate', id)
                }
            })
        }
        // observer.disconnect()
    })
    observer.observe(el, { childList: true })

    return em
}