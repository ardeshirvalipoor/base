import { Base } from '../../base'
import { TextBox } from '../input/text-box'

export const DropdownSearch = (config: any = {}) => {

    const base = Base('div')
    const input = TextBox(config.placeholder || 'Search', 'text', { direction: 'rtl' })
    input.on('input', (value: any) => base.emit('input', value))
    input.cssClass({
        borderRadius: '14px',
        height: '52px',
        padding: '0 16px',
        border: '1px solid #ffffff8c'
    })

    base.append(input)

    return base
}