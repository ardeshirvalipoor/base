import { Div } from '../../native/div'

export const DropdownItem = (item: any = {}) => {

    const self = Div(item.title || item.value)
    self.el.onclick = () => self.emit('item-selected', item)
    self.cssClass({
        margin: '10px',
        fontWeight: '100'
    })

    return {
        ...self,
        select() {

        },
        deselect(){

        }
    }
}