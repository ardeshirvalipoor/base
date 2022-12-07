import { Div } from "../../native/div"
import { Input, IInput } from "../../native/input"
import { SelectItem } from "./select-item"
import { SelectList } from "./select-list"

export const SelectX = (options: any = {}) => {
    const base = Div()
    const search = Input()
    const list = SelectList()

    search.on(['key-enter', 'key-tab'], ({ value }: any) => {
        const existingValue = list.getValue()
        if (existingValue) {
            base.emit('item-selected', existingValue)
        } else {
            base.emit('new-item', value)
        }
        list.style({ display: 'none' })
        search.setValue('')
    })
    search.on('key-escape', () => list.style({ display: 'none' }))
    // search.on('key-tab', () = list.hide())
    // search.on('key-backspace', () = list.hide())
    // search.on('key-home', () = list.home())
    // search.on('key-end', () = list.end())
    // search.on('key-page-up', () = list.pageUp())
    // search.on('key-page-down', () = list.pageDown())
    let t: NodeJS.Timeout
    search.on('key-arrow-up', list.up)
    search.on('key-arrow-down', list.down)
    search.on('focus', () => {
        clearTimeout(t)
        list.style({ display: 'block' })
        base.emit('focus')
    })
    search.on('blur', (e: InputEvent) => {
        t = setTimeout(() => {
            list.style({ display: 'none' }) // Todo: This is not working always
        }, 300)
    })
    search.on('input', (i: IInput<string>) => {
        list.filter(i.value, options.fields)
        list.style({ display: 'block' })
        base.emit('input', i.value)
    })
    list.on('item-selected', (value: any) => {
        base.emit('item-selected', value)
        search.setValue('')
        // list.style({ display: 'none' }, 100)
    })
    base.append(search, list)

    base.cssClass({
        position: 'relative',
    })

    return Object.assign(base, {
        search,
        list,
        fill(items: any[]) {
            list.fill(items)
        },
        add(item: any) {
            list.addItem(item)
        },
        remove(item: any) {
            list.removeItem(item)
        },
        // exclude(item: string): void {
        //     list.exclude(item)
        // },
        // include(item: string): void {
        //     list.include(item)
        // }
    })
}