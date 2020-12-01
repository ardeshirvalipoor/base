// credits https://stackoverflow.com/users/1927876/adam-zerner
export function isEmpty(obj: Object) {
    if (typeof obj !== 'object') return false
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            return false
        }
    }

    return JSON.stringify(obj) === JSON.stringify({})
}