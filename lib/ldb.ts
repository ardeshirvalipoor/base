export default {
    get(key: string) {
        const raw = String(localStorage.getItem(key))
        try {
            return JSON.parse(raw)
        } catch (err) {
            return raw
        }
    },
    save(value: any, key?: any) {
        if (typeof value == 'object') value = JSON.stringify(value)
        if (typeof value != 'string') value = value?.toString()
        if (key) {
            localStorage.setItem(key, value)
            return value
        }
        return {
            value,
            as(key: string) {
                localStorage.setItem(key, value)
            }
        }
    }
}