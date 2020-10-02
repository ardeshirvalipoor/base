import { Self } from '../../self'
import { DropdownItem } from './dropdown-item'

export const DropdownList = (config: any = {}) => {

    const self = Self()

    self.cssClass({
        overflowX: 'hidden',
        overflowY: 'scroll',
        height: config.height || 300 + 'px'
    })

    return {
        ...self,
        fill(data: any[]) {
            self.empty()
            data.map(item => {
                const i = DropdownItem(item)
                i.on('item-selected', (item: any) => self.emit('item-selected', item))
                self.append(i)
            })
        }
    }
}