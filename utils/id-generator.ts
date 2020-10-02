const idGenerator = (id = 0) => () => id++
export const nextId = idGenerator()