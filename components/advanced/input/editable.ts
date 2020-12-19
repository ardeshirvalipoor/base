import { Self } from '../../self'

export const Editable = () => {

    const self = Self()
    self.el.contentEditable = 'true'

    self.el.addEventListener('input', () => {
        self.emit('input')
    })
    self.cssClass({
        pointerEvents: 'all',
        userSelect: 'text', // IOS
        overflow: 'scroll',
        // height: '100%'
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
            self.el.innerHTML = val
        },
        clear() {
            self.el.innerHTML = ''
        }
    }
}