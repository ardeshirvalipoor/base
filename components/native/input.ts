import { Self } from '../self'

export const Input = (placeholder = '', type = 'text', options = {}) => {

    const self = type == 'textarea'?  Self<HTMLInputElement>('textarea'):  Self<HTMLInputElement>('input')
    self.el.setAttribute('type', type)
    self.el.setAttribute('placeholder', placeholder)

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