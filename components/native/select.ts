import { Self } from '../self'

export const Select = (content: string = '') => {

    const self = Self<HTMLSelectElement>('select')
    self.el.innerHTML = content

    return {
        ...self
    }
}