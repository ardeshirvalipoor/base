import { Self } from '../../self'
import { TextBox } from '../input/text-box'

export const DropdownSearch = (config: any = {}) => {

    const self = Self()
    const input = TextBox(config.placeholder || 'جستجو', 'text', { direction: 'rtl' })
    input.on('input', (value: any) => self.emit('input', value))
    input.cssClass({
        borderRadius: '14px',
        height: '52px',
        padding: '0 16px',
        border: '1px solid #ffffff8c'
    })

    self.append(input)

    return self
}