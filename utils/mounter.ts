import emitter from "./emitter"

export function observe(el: HTMLElement): Promise<HTMLElement[]> {
    return new Promise((resolve, reject) => {
        const addedNodes: HTMLElement[] = []
        let observer = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                mutation.addedNodes.forEach((node: HTMLElement) => {
                    if (node instanceof HTMLElement) addedNodes.push(node)
                })
            }
            observer.disconnect()
            resolve(addedNodes)
        })
        observer.observe(el, { childList: true })
    })
}