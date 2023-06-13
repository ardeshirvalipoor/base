import { Input } from '../../native/input'
import { Base } from '../../base'
import { Span } from '../../native/span'
import { HIDE, SHOW, X, Y } from '../../../helpers/style'
import { CS } from '../../../utils/styler'
type ValueType = string | number

// Needs huge refactoring
export function TextBox<T extends ValueType>(placeholder = '', type = 'text', options: ITextbox = {}) {

    // Todo: should be extendable
    const opts = { ...options }
    if (!opts.textAlign) opts.textAlign = opts.direction == 'rtl' ? 'right' : 'left'

    const base = Base('div')
    const input = Input<T>('', type)
    input.el.setAttribute('enterkeyhint', 'done')

    const p = Span(placeholder)
    base.append(input, p)
    // Todo: implement direciton
    base.cssClass({
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        // height: '100%',
        // width: '100%'
    })
    p.cssClass({
        fontWeight: options.fontWeight || '100',
        pointerEvents: 'none',
        fontSize: opts.fontSize + 'px',
        // marginLeft: '2px',
        opacity: '0.5',
        textAlign: opts.textAlign,
        width: '100%',
        
    })
    const inputStyle = <CS>{
        position: 'absolute',
        boxShadow: 'none',
        right: '0',
        left: '0',
        backgroundColor: 'transparent',
        border: 'none',
        outline: 'none',
        textAlign: opts.textAlign || 'left',
        width: '100%',
        height: '100%',
        direction: opts.direction || 'unset',
        letterSpacing: (opts.letterSpacing ?? 0) + 'px',
        color: opts.color,
        fontSize: opts.fontSize + 'px',
        // padding: type == 'textarea' ? '10px 0 20px 0' : '3px 0 0 0',
        fontWeight: opts.fontWeight
    }
    input.cssClass(inputStyle)
    // i.el.value = options.value || ''
    let t: NodeJS.Timeout
    input.el.addEventListener('input', () => {
        clearTimeout(t)
        if (opts.textAlign == 'center') {
            p.style(Y(input.el.value ? -20 : 0))
        } else {
            p.style(X(input.el.value ? opts.direction == 'rtl' ? -20 : 20 : 0))
        }
        p.el.style.opacity = input.el.value ? '0' : '.5'
        t = setTimeout(async () => {
            base.emit('input', input.el.value)
        }, options.timeout || 0)
    })
    input.el.addEventListener('keydown', (e: KeyboardEvent) => {
        switch (e.key) {
            case 'Enter': return base.emit('submit', input.el.value)
            case 'Escape': return base.emit('escape')
            // case 'ArrowRight': return base.emit('ArrowRight')
        }
    })
    input.el.addEventListener('focus', () => {
        base.emit('focus')
    })
    input.el.addEventListener('blur', () => {
        base.emit('blur')
    })


    // Todo: move this to editable
    return Object.assign(
        base,
        {
            input,
            placeholder: p,
            focus() {
                input.el.focus()
            },
            select() {
                input.el.select()
            },
            blur() {
                input.blur()
            },
            getValue() {
                return input.el.value
            },
            setValue(val: T) {
                input.el.value = val as string
            },
            clear() {
                input.el.value = ''
                p.el.style.transform = `translateX(0px)`
                p.el.style.opacity = '.5'
                base.emit('input', input.el.value)
            }
        }
    )
}

interface ITextbox {
    direction?: string,
    placeholderColor?: string,
    inputColor?: string,
    value?: string,
    textAlign?: string,
    letterSpacing?: string,
    fontSize?: number,
    fontWeight?: string,
    color?: string,
    timeout?: number
}