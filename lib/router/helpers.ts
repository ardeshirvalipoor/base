export function parseQuery() {
    const q = location.search
    if (!q) return {}
    return q.split('&').reduce((query: any, item: string) => {
        const [key, value] = item.split('=')
        console.log({ key, value })

        if (key) query[key] = value
        return query
    }, {})
}


export function findPossibleLink(e: MouseEvent) {
    if (!e.target) return undefined
    return findParent(e.target)
    // TODO: for touch handling
    function findParent(el: HTMLElement | any): any | undefined {
        if (!el) return undefined
        if (el.getAttribute('href')) return { href: el.getAttribute('href'), target: el.getAttribute('target') }
        return findParent(el.parentElement)
        //TODO return target
    }
}