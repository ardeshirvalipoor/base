import { IBaseComponent } from '../components/base'

export function editable(base: IBaseComponent<any>) {
    return {
        focus() {
            base.el.focus()
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
            // base.style({pointerEvents: 'none'})
        },
        getValue() {
            return base.el.innerHTML
        },
        getText() {
            return base.el.innerText
        },
        setValue(val: string) {
            base.el.value = <string>val
            var event = new Event('set-value')
            base.el.dispatchEvent(event)
        },
        clear() {
            base.el.innerHTML = ''
        }
    }
}
