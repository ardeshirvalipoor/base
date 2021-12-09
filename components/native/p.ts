import { texter } from '../../utils/texter'
import { Base } from '../base'

export const P = (content: string = '') => {

    const base = Base('p')
    base.el.innerHTML = content

    return Object.assign(
        base,
        texter(base)
    )
}