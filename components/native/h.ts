import { texter } from '../../utils/texter'
import { Base } from '../base'

export const H4 = (content: string = '') => {
    const base = Base('h4')
    base.el.innerHTML = content

    return Object.assign(base, texter(base))
}

export const H3 = (content: string = '') => {
    const base = Base('h3')
    base.el.innerHTML = content

    return Object.assign(base, texter(base))
}

export const H2 = (content: string = '') => {
    const base = Base('h2')
    base.el.innerHTML = content

    return Object.assign(base, texter(base))
}

export const H1 = (content: string = '') => {
    const base = Base('h1')
    base.el.innerHTML = content

    return Object.assign(base, texter(base))
}
