import { Self, ISelf } from '../self'

export const Span = (content: string = '') => {

    const self = Self<HTMLSpanElement>('span')
    self.el.textContent = content

    return {
        ...self,
        text(content: string) {
            self.el.textContent = content
        }
    }
}