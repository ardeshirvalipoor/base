import { Input } from '../../native/input'
import { Self } from '../../self'
import { Span } from '../../native/span'
import { Div } from '../../native/div'
import { CS } from '../../../utils/styler'
import { HIDE, SHOW, X, Y } from '../../../helpers/style'

export function TextBox(placeholder = '', type = 'text', options: ITextbox = {}) {

    // Todo: should be extendable
    const opts = { color: '#ffffff', fontWeight: '100', fontSize: 16, direction: 'ltr', letterSpacing: 0, ...options }
    if (!opts.textAlign) opts.textAlign = opts.direction == 'rtl' ? 'right' : 'left'

    const self = Self()
    const input = Input('', type)
    const p = Span(placeholder)
    const comma = Div()
    self.append(input, p, comma)

    // Todo: implement direciton
    self.cssClass({
        position: 'relative',
        height: '100%',
        width: '100%'
    })

    p.cssClass({
        position: 'absolute',
        transition: 'all .16s',
        color: opts.placeholderColor || (opts.color + '55'),
        fontSize: opts.fontSize + 'px',
        right: opts.direction == 'rtl' ? '18px' : '',
        left: opts.direction == 'ltr' ? '2px' : '',
        pointerEvents: 'none',
        wordSpacing: '-2px',
        fontStyle: 'italic',
        fontWeight: opts.fontWeight,
        width: '100%',
        textAlign: opts.textAlign || 'left',
        display: 'flex',
        alignItems: 'center',
        justifyContent: opts.textAlign || 'left',
        height: '100%'
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
        padding: type == 'textarea' ? '10px 0 20px 0' : '3px 0 0 0',
        fontWeight: opts.fontWeight
    }
    input.cssClass(inputStyle)
    comma.cssClass({ ...inputStyle, pointerEvents: 'none', width: '', top: '10px' })
    // i.el.value = options.value || ''
    input.el.addEventListener('input', () => {
        if (opts.textAlign == 'center') {
            p.style(Y(input.el.value ? -20 : 0))
        } else {
            p.style(X(input.el.value ? opts.direction == 'rtl' ? -20 : 20 : 0))
        }
        p.el.style.opacity = input.el.value ? '0' : '1'
        self.emit('input', input.el.value)
        if (type == 'number') addCommas()
    })
    input.el.addEventListener('keydown', (e: KeyboardEvent) => {
        switch (e.key) {
            case 'Enter': return self.emit('submit', input.el.value)
            case 'Escape': return self.emit('escape')
            // case 'ArrowRight': return self.emit('ArrowRight')
        }
    })
    input.el.addEventListener('focus', (e: KeyboardEvent) => {
        self.emit('focus')
    })
    input.el.addEventListener('blur', (e: KeyboardEvent) => {
        self.emit('blur')
    })
    function addCommas() {
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
                console.log({ width })

                // dummy.text('')
                const slash = Div(',')
                slash.style({ right: width - 3 + 'px', top: '8px', position: 'absolute' })
                // comma.append(slash)
            }, i)
        }
    }
    return {
        ...self,
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
            self.emit('input', input.el.value)
        }
    }
}

interface ITextbox {
    direction?: string,
    placeholderColor?: string,
    inputColor?: string,
    value?: string,
    textAlign?: string,
    letterSpacing?: string,
    fontSize?: string,
    fontWeight?: string,
    color?: string
}