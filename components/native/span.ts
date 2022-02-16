import { texter } from '../../utils/texter'
import { Base, IBaseComponent } from '../base'

export const Span = (content: string = '') => {

    const base = Base('span')
    base.el.innerHTML = content
    
    return Object.assign(
        base,
        texter(base)
    )
}