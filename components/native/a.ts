import { texter } from '../../utils/texter'
import { Base } from '../base'

export const A = (href: string, title: string, target = '_self') => {

    const base = Base<HTMLLinkElement>('a')
    base.el.href = href
    base.el.setAttribute('target', target)
    base.el.textContent = title

    return base
}