import { Base } from "../../base"
import { Div } from "../../native/div"
import { ISelectItem, SelectListItem } from "./select-list-item"

export const SelectList = (config: ISelectConfig = { height: 102 }) => {
    const base = Base()
    let items: ISelectItem[] = []
    let index = 0
    let current: ISelectItem

    base.append(...items)
    base.cssClass({
        overflow: 'hidden',
        height: config.height + 'px',
        overflowY: 'auto'
    })

    return Object.assign(base, {
        fill(_items: ISelectItem[]) {
            base.empty()
            index = 0
            items = _items
            items.map(item => base.append(item))
            current = items[0]
            if (current) current.select()
        },
        up() {
            index--;
            if (index < 0) index = items.length - 1
            handleSelection()
        },
        down() {
            index++;
            if (index > items.length - 1) index = 0
            handleSelection()
        }
    })

    function handleSelection() {
        if (!items.length) return
        if (current) current.deselect()
        current = items[index]
        current.select()
        if (outOfView(base, current)) current.el.scrollIntoView({ behavior: 'smooth' })
    }
}

function outOfView(base: any, current: any) { //?
    const currentBox = current.el.getBoundingClientRect()
    const baseBox = base.el.getBoundingClientRect()
    return currentBox.top < baseBox.top || currentBox.bottom > baseBox.bottom
}


export interface ISelectConfig {
    height: number
}