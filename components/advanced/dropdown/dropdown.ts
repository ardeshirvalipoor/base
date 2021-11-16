import { Div } from '../../native/div'
import { Base } from '../../base'
import { DropdownList } from './dropdown-list'
import { DropdownSearch } from './dropdown-search'

export const Dropdown = (data: any = []) => {
    let d = data

    const base = Base()
    const search = DropdownSearch()
    const list = DropdownList({ height: 300 })
    list.fill(data.slice(0, 10))

    list.on('item-selected', (item: any) => base.emit('item-selected', item))
    search.on('input', (value: string) => {
        const filtered = d.filter(d => d?.title?.toString()?.toLowerCase()?.includes(value.toString()?.toLowerCase()) || d?.value?.toString()?.toLowerCase()?.includes(value.toString()?.toLowerCase()))
        list.fill(filtered)
    })
    base.append(search, list)
    base.cssClass({
    })


    return Object.assign(
        base,
        {
            getValue() {
                return 'value'
            },
            fill(data: any[]) {
                d = data
                list.fill(data)
            }
        }
    )
}