import { IBase } from '../components/base'

export function editable<T extends HTMLElement>(base: IBase<T>) {
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
