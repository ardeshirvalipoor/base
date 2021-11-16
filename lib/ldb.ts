export default {
    get(key: string) {
        const raw = String(localStorage.getItem(key))
        try {
            return JSON.parse(raw)
        } catch (err) {
            return raw
        }
    },
    save(value: any) {
        if (typeof value == 'object') value = JSON.stringify(value)
        if (typeof value != 'string') value = value?.toString()
        return {
            value,
            as(key: string) {
                localStorage.setItem(key, value)
            }
        }
    }
}