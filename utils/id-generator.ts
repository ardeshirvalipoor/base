export const idGenerator = (id = 0) => () => (id++).toString()
export const nextId = idGenerator()

export const shortUUID = () => {
    return (new Date().valueOf().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(-12)
}

// Credits: https://stackoverflow.com/users/109538/broofa
export const uuidv4 = () => {
    return (String(1e7) + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (+c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> +c / 4).toString(16)
    )
}