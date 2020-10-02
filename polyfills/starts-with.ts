if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value(search: string, rawPos: number) {
            var pos = rawPos > 0 ? rawPos | 0 : 0
            return this.substring(pos, pos + search.length) === search
        }
    })
}