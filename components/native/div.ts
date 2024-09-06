import { texter } from '../../utils/texter'
import { Base } from '../base'

export const Div = (content: string = '') => {

    const base = Base('div')
    
    base.el.innerHTML = content

    return Object.assign(
        base,
        texter(base)
    )
}