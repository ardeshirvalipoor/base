import { Base } from '../base'

export const Input = <T extends string | number>(placeholder = '', type = 'text', options: any = {}) => {

    const base = type == 'textarea' ? Base('textarea') : Base('input')
    base.el.setAttribute('type', type)
    base.el.setAttribute('placeholder', placeholder)
    if (options['accept']) base.el.setAttribute('accept', options['accept']) // For now
    if ('value' in options) base.el.value = options['value']
    base.el.onblur = (e: Event) => base.emit('blur', e)
    base.el.onfocus = (e: Event) => base.emit('focus', e)
    base.el.oninput = (e: Event) => base.emit('input', { e, value: base.el.value })
    base.el.onclick = (e: Event) => base.emit('click', e)
    base.el.onkeydown = (v: KeyboardEvent) => {
        v.stopPropagation()
        switch (v.key) {
            case 'Enter': base.emit('key-enter', { event: v, value: base.el.value }); break
            case 'Escape': base.emit('key-escape', v); break
            case 'Tab': base.emit('key-tab', { event: v, value: base.el.value }); break
            case 'Backspace': base.emit('key-backspace', v); break
            case 'Home': base.emit('key-home', v); break
            case 'End': base.emit('key-end', v); break
            case 'PageUp': base.emit('key-page-up', v); break
            case 'PageDown': base.emit('key-page-down', v); break
            case 'ArrowUp': base.emit('key-arrow-up', v); break
            case 'ArrowDown': base.emit('key-arrow-down', v); break
            default:
                base.emit('key', { event: v, value: base.el.value, key: v.key})
        }
    }

    return Object.assign(
        base,
        {
            focus() {
                base.el.focus()
            },
            select() {
                base.el.select()
            },
            blur() {
                base.el.blur()
            },
            getValue() {
                return type == 'textarea' ? base.el.innerHTML : base.el.value
            },
            setValue(val: T) {
                base.el.value = <string>val
                // var event = new Event('set-value')
                // base.el.dispatchEvent(event)
                triggerInputEvent(base.el)
            },
            clear() {
                base.el.value = ''
                triggerInputEvent(base.el)
            }
        }
    )
}

export interface IInput<T> {
    e: InputEvent,
    value: T
}

function triggerInputEvent(inputElement: any) {
    const event = new Event('input', { bubbles: true });
    inputElement.dispatchEvent(event);
}