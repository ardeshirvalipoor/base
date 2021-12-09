import { Div } from '../../native/div'
import { Base } from '../../base'
import { DropdownList } from './dropdown-list'
import { DropdownSearch } from './dropdown-search'

export const Dropdown = (data: any = []) => {
    let _data = data

    const base = Base('div')
    const search = DropdownSearch()
    const list = DropdownList({ height: 300 })
    list.fill(data.slice(0, 10))

    list.on('item-selected', (item: any) => base.emit('item-selected', item))
    search.on('input', (value: string) => {
        const filtered = _data.filter((d:any) => d?.title?.toString()?.toLowerCase()?.includes(value.toString()?.toLowerCase()) || d?.value?.toString()?.toLowerCase()?.includes(value.toString()?.toLowerCase()))
        list.fill(filtered)
    })
    base.append(search, list)


    return Object.assign(
        base,
        {
            getValue() {
                return 'value'
            },
            fill(data: any[]) {
                _data = data
                list.fill(data)
            }
        }
    )
}