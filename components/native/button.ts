import { Self } from '../self'

export const Button = (text: string, options = {}) => {

    const self = Self<HTMLButtonElement>('button')
    self.el.innerHTML    = text

    return {
        ...self,
        focus() {
            self.el.focus()
        },
        blur() {
            self.el.blur()
        }
    }
}