import { IBaseComponent } from '../interfaces/base'

export function editable(base: IBaseComponent<any>) {
    return {
        focus() {
            base.el.focus()
            base.style({pointerEvents: 'all'})
            var range = document.createRange()
            range.selectNodeContents(base.el)
            range.collapse(false)
            var sel = window.getSelection()
            if (sel) {
                sel.removeAllRanges()
                sel.addRange(range)
            }
        },
        blur() {
            base.el.blur()
        },
        getValue() {
            return base.el.innerHTML
        },
        setValue(val: string) {
            base.el.innerHTML = val
        },
        clear() {
            base.el.innerHTML = ''
        }
    }
}
