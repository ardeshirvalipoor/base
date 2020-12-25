import { Div } from '../../native/div'
import { Self } from '../../self'
import { DropdownList } from './dropdown-list'
import { DropdownSearch } from './dropdown-search'

export const Dropdown = (data: any = []) => {
    let d = data
    
    const self = Self()
    const search = DropdownSearch()
    const list = DropdownList({height: 300})
    list.fill(data.slice(0, 10))

    list.on('item-selected', (item:any)=> self.emit('item-selected', item))
    search.on('input', (value: string) => {
        const filtered = d.filter(d => d?.title?.toString()?.toLowerCase()?.includes(value.toString()?.toLowerCase()) || d?.value?.toString()?.toLowerCase()?.includes(value.toString()?.toLowerCase()))
        list.fill(filtered)
    })
    self.append(search, list)
    self.cssClass({
    })

    return {
        ...self,
        getValue() {
            return 'value'
        },
        fill(data: any[]){
            d = data
            list.fill(data)
        }
    }
}