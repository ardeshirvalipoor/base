import { Input } from '../../native/input'
import { Base } from '../../base'
import { Span } from '../../native/span'
import { Div } from '../../native/div'
import { CS } from '../../../utils/styler'
import { HIDE, SHOW, X, Y } from '../../../helpers/style'


// Needs huge refactoring
export function TextBox(placeholder = '', type = 'text', options: ITextbox = {}) {

    // Todo: should be extendable
    const opts = { ...options }
    if (!opts.textAlign) opts.textAlign = opts.direction == 'rtl' ? 'right' : 'left'

    const base = Base('div')
    const input = Input('', type)
    const p = Span(placeholder)
    const comma = Div()
    base.append(input, p)
    if (type === 'number') base.append(comma)
    // Todo: implement direciton
    base.cssClass({
        position: 'relative',
        // height: '100%',
        // width: '100%'
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
        direction: opts.direction,
        letterSpacing: opts.letterSpacing + 'px',
        color: opts.color,
        fontSize: opts.fontSize + 'px',
        // padding: type == 'textarea' ? '10px 0 20px 0' : '3px 0 0 0',
        fontWeight: opts.fontWeight
    }
    input.cssClass(inputStyle)
    comma.cssClass({ ...inputStyle, pointerEvents: 'none', width: '', top: '10px' })
    // i.el.value = options.value || ''
    let t = 0
    input.el.addEventListener('input', () => {
        clearTimeout(t)
        if (opts.textAlign == 'center') {
            p.style(Y(input.el.value ? -20 : 0))
        } else {
            p.style(X(input.el.value ? opts.direction == 'rtl' ? -20 : 20 : 0))
        }
        p.el.style.opacity = input.el.value ? '0' : '1'
        t = setTimeout(async () => {
            base.emit('input', input.el.value)
        }, options.timeout || 0)
        if (type == 'number') addCommas()
    })
    input.el.addEventListener('keydown', (e: KeyboardEvent) => {
        switch (e.key) {
            case 'Enter': return base.emit('submit', input.el.value)
            case 'Escape': return base.emit('escape')
            // case 'ArrowRight': return base.emit('ArrowRight')
        }
    })
    input.el.addEventListener('focus', (e: KeyboardEvent) => {
        base.emit('focus')
    })
    input.el.addEventListener('blur', (e: KeyboardEvent) => {
        base.emit('blur')
    })
    function addCommas() {
        console.log('in add comma');
        
        comma.empty()
        const dummy = Div()
        dummy.style({
            inputStyle,
            display: 'inline-block',
            ...HIDE
        })
        comma.append(dummy/* , slash */)
        for (let i = 3; i < String(input.el.value).length; i += 3) {
            dummy.text(input.el.value.slice(-i))
            setTimeout(() => {

                const { width } = dummy.el.getBoundingClientRect()

                // dummy.text('')
                const slash = Div(',')
                slash.style({ right: width - 3 + 'px', top: '8px', position: 'absolute' })
                // comma.append(slash)
            }, i)
        }
    }

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
            setValue(val: string) {
                input.el.value = val
            },
            clear() {
                input.el.value = ''
                p.el.style.transform = `translateX(0px)`
                p.el.style.opacity = '1'
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