import { Div } from '../../native/div'

export const DropdownItem = (item: any = {}) => {
    if (typeof item == 'string') {
        item = {
            title: item, value: item
        }
    }
    const base = Div(item.title || item.value)
    base.el.onclick = () => base.emit('item-selected', item)
    base.cssClass({
        margin: '10px',
        fontWeight: '100'
    })

    return Object.assign(
        base,
        {
            select() {

            },
            deselect() {

            }
        }
    )
}