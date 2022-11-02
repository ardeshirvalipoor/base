import { Base } from "../../base"
import { ISelectListItemComponent } from "./select-item"

export const SelectList = <T>() => {
    const base = Base('ul')
    let items: ISelectListItemComponent<T>[] = [] // Todo: pass T
    let index = 0
    let current: ISelectListItemComponent<T> | undefined

    base.cssClass({
        overflow: 'hidden',
        overflowY: 'auto',
        overscrollBehavior: 'contain',
    })

    return Object.assign(base, {
        fill(_items: ISelectListItemComponent<T>[]) {
            // Todo: implement pagination
            base.empty()
            index = 0
            items = [..._items]
            items.map((item, i) => {
                item.el.addEventListener('click', (data: any) => {
                    index = i
                    handleSelection()
                    base.emit('item-selected', item.getValue())
                })
                base.append(item)
            })
            current = items[0]
            if (current) current.select()
        },
        filter(q: string | null = '', fields: string[] = ['value']) {
            // base.empty()
            index = 0
            const n = items.filter(item => {
                const isThere = fields.some(field => {
                    const value: any = item.getValue()
                    const compare = typeof value === 'string' ? value : value[field]
                    return q === '' || q === null || compare.toLowerCase().includes(q?.toString().toLowerCase())
                })
                if (isThere) {
                    item.style({ display: 'block' })
                    // base.append(item)
                } else {
                    item.style({ display: 'none' })
                    if (item === current) {
                        current.deselect()
                        current = undefined
                    }
                    // base.remove(item)
                }
                return isThere
            })

            // found.map((item, i) => {
            // base.append(item)
            // })

            if (!current) current = n[0]
            if (current) current.select()
        },
        up() {
            index--
            if (index < 0) index = items.length - 1
            handleSelection()
        },
        down() {
            index++
            if (index > items.length - 1) index = 0
            handleSelection()
        },
        getValue() {
            if (!current) return
            return current.getValue()
        },
        removeItem(item: ISelectListItemComponent<T>) {
            // base.remove(item)
            // Todo: implement...
            items = items.filter(i => i !== item)
        },
        addItem(item: ISelectListItemComponent<T>) {
            // base.append(item)
            items.push(item)
        }
    })

    function handleSelection() {
        if (!items.length) return
        if (current) current.deselect()
        current = items[index]
        current.select()
        if (outOfView(base, current)) current.el.scrollIntoView({ block: 'nearest', behavior: 'smooth' }) 
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