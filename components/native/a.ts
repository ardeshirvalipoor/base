import { texter } from '../../utils/texter'
import { Self } from '../self'

export const A = (href: string, title: string) => {

    const self = Self<HTMLLinkElement>('a')
    self.el.href = href
    self.el.textContent = title

    return {
        ...self,
    }
}