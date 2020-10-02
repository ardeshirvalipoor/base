import { texter } from '../../utils/texter'
import { Self } from '../self'

export const Div = (content: string = '') => {

    const self = Self<HTMLDivElement>('div')
    self.el.innerHTML = content

    return {
        ...self,
        ...texter(self)
    }
}