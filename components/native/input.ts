import { Base } from '../base'

export const Input = <T extends string | number>(placeholder = '', type = 'text', options: any = {}) => {

    const base = type == 'textarea' ? Base<HTMLInputElement>('textarea') : Base<HTMLInputElement>('input')
    base.el.setAttribute('type', type)
    base.el.setAttribute('placeholder', placeholder)
    if (options['accept']) base.el.setAttribute('accept', options['accept']) // For now

    base.el.onblur  = (e: Event) => base.emit('blur' , e)
    base.el.onfocus = (e: Event) => base.emit('focus', e)
    base.el.oninput = (e: Event) => base.emit('input', e)
    base.el.onclick = (e: Event) => base.emit('click', e)
    base.el.onkeydown = (v: KeyboardEvent) => { base.emit('keydown', v) }
    return Object.assign(
        base,
        {
            focus() {
                base.el.focus()
            },
            blur() {
                base.el.blur()
            },
            getValue() {
                return type == 'textarea' ? base.el.innerHTML : base.el.value
            },
            setValue(val:T) {
                base.el.value = <string>val
            }
        }
    )
}