import { Self } from '../../self'

export const Editable = () => {

    const self = Self()
    self.el.contentEditable = 'true'

    self.el.addEventListener('input', () => {
        self.emit('input')
    })
    self.cssClass({
        overflow: 'scroll',
        height: '100%'
    })

    return {
        ...self,
        focus() {
            self.el.focus()
        },
        blur() {
            self.el.blur()
        },
        getValue() {
            return self.el.innerHTML
        },
        setValue(val: string) {
            self.el.value = val
        },
        clear() {
            self.el.value = ''
        }
    }
}