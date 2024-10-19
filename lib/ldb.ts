function save(value: any): { as: (key: any) => void }
function save(...args: any[]): void
function save(...args: any[]) {
    if (args.length > 1) {
        let [key, value] = args
        if (typeof value === 'object') value = JSON.stringify(value)
        localStorage.setItem(key, value)
        return
    }
    let [value] = args
    if (typeof value === 'object') value = JSON.stringify(value)

    return {
        as(key: string) {
            localStorage.setItem(key, value)
        }
    }
}

function get(key: string) {
    const raw = String(localStorage.getItem(key) || '')
    try {
        return JSON.parse(raw)
    } catch (err) {
        return raw
    }
}

function remove(key: string) {
    localStorage.removeItem(key)
}

function clear() {
    localStorage.clear()
}

export default {
    get,
    set: save,
    save,
    remove,
    clear
}

