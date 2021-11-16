import { texter } from '../../utils/texter'
import { Base } from '../base'

export const H4 = (content: string = '') => {

    const base = Base<HTMLDivElement>('h4')
    base.el.innerHTML = content


    return Object.assign(
        base,
        {
            ...texter(base)
        }
    )
}