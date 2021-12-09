import { IBaseComponent } from '../components/base'

export function editable(base: IBaseComponent<any>) {
    return {
        focus() {
            base.el.focus()
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
