import { Base } from '../base'

export const Select = (content: string = '') => {

    const base = Base<HTMLSelectElement>('select')
    base.el.innerHTML = content

    return base
}