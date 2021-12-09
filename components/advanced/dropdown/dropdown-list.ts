import { Base } from '../../base'
import { DropdownItem } from './dropdown-item'

export const DropdownList = (config: any = {}) => {

    const base = Base('div')

    base.cssClass({
        overflowX: 'hidden',
        overflowY: 'scroll',
        height: config.height ? (config.height + 'px') : '100%'
    })


    return Object.assign(
        base,
        {
            fill(data: any[]) {
                base.empty()
                data.map(item => {
                    const i = DropdownItem(item)
                    i.on('item-selected', (item: any) => base.emit('item-selected', item))
                    base.append(i)
                })
            }
        }
    )
}