import { Self } from '../../self'
import { TextBox } from '../input/text-box'

export const DropdownSearch = (config: any = {}) => {

    const self = Self()
    const input = TextBox(config.placeholder || 'جستجو', 'text', {direction: 'rtl'})
    input.on('input', (value: any) => self.emit('input', value))
    input.cssClass({
        height: '40px',
        backgroundColor: '#00000044',
        borderRadius: '20px'
    })

    self.append(input)

    return self
}