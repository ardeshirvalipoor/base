import { emitter, createEmitter } from './emitter'

let isInitialized = false

export function observe() {
    if (isInitialized) return
    let observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                Array.from(mutation.addedNodes).forEach((node: HTMLElement) => {
                    if (node instanceof HTMLElement) {
                        emitter.emit('mutate', node)
                    }
                })
            }
        }
    })
    observer.observe(document, { childList: true, subtree: true })
    isInitialized = true
}

export default {
    observe
}