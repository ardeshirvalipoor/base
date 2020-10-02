import { texter } from '../../utils/texter'
import { Self } from '../self'

export const H4 = (content: string = '') => {

    const self = Self<HTMLDivElement>('h4')
    self.el.innerHTML = content

    return {
        ...self,
        ...texter(self)
    }
}