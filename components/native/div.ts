import { texter } from '../../utils/texter'
import { Base } from '../base'

export const Div = (content: string = '') => {

    const base = Base<HTMLDivElement>('div')
    base.el.innerHTML = content
    // base.el.textContent = content


    return Object.assign(
        base,
        {
            ...texter(base)
        }
    )
}