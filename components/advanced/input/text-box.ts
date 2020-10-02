import { Input } from '../../native/input'
import { Self } from '../../self'
import { Span } from '../../native/span'
import { Div } from '../../native/div'
import { CS } from '../../../utils/styler'
import { emitter } from '../../../utils/emitter'

export function TextBox(placeholder = '', type = 'text', options: ITextbox = {}) {

    const opts = { color: '#ffffff', fontWeight: 100, fontSize: 16, direction: 'ltr', ...options }
    console.log({ opts })

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
        top: (opts.fontSize / 2 + 5) + 'px',
        fontSize: opts.fontSize + 'px',
        right: opts.direction == 'rtl' ? '18px' : '',
        left: opts.direction == 'ltr' ? '0px' : '',
        pointerEvents: 'none',
        wordSpacing: '-2px',
        fontStyle: 'italic',
        fontWeight: '300',
    })
    const inputStyle = <CS>{
        position: 'absolute',
        boxShadow: 'none',
        right: opts.direction == 'rtl' ? '18px' : '',
        left: opts.direction == 'ltr' ? '0px' : '',
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
        padding: type == 'textarea' ? '10px 0 20px 0' : '5px 20px 0',
        fontWeight: opts.fontSize
    }
    input.cssClass(inputStyle)
    comma.cssClass({ ...inputStyle, pointerEvents: 'none', width: '', top: '10px' })
    // i.el.value = options.value || ''
    input.el.addEventListener('input', () => {
        p.el.style.transform = `translateX(${input.el.value ? opts.direction == 'rtl' ? -20 : 20 : 0}px)`
        p.el.style.opacity = input.el.value ? '0' : '1'
        self.emit('input', input.el.value)
        if (type == 'number') addCommas()
    })
    input.el.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key == 'Enter') self.emit('submit', input.el.value)
    })
    function addCommas() {
        comma.empty()
        const dummy = Div()
        comma.append(dummy/* , slash */)
        for (let i = 3; i < String(input.el.value).length; i += 3) {
            dummy.text(input.el.value.slice(-i))
            const { width } = dummy.el.getBoundingClientRect()
            dummy.text('')
            const slash = Div(',')
            slash.style({ right: width - 3 + 'px', top: '5px', position: 'absolute' })
            comma.append(slash)
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
    fontSize?: number,
    color?: string
}