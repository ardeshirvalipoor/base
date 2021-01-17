import { texter } from '../../utils/texter'
import { Self } from '../self'

export const A = (href: string, title: string, target = '_self') => {

    const self = Self<HTMLLinkElement>('a')
    self.el.href = href
    self.el.setAttribute('target', target)
    self.el.textContent = title

    return {
        ...self,
    }
}