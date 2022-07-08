import { Div } from "../../native/div"
import { Input, IInput } from "../../native/input"
import { SelectItem } from "./select-item"
import { SelectList } from "./select-list"

export const Select = (options: any = {}) => {
    const base = Div()
    const search = Input()
    const list = SelectList()

    search.on('key-enter', ({ value }: any) => {
        const existingValue = list.getValue()
        base.emit('item-selected', existingValue || value)
        list.style({ display: 'none' })
        search.setValue('')
    })
    // search.on('key-escape', () = list.hide())
    // search.on('key-tab', () = list.hide())
    // search.on('key-backspace', () = list.hide())
    // search.on('key-home', () = list.home())
    // search.on('key-end', () = list.end())
    // search.on('key-page-up', () = list.pageUp())
    // search.on('key-page-down', () = list.pageDown())

    search.on('key-arrow-up', list.up)
    search.on('key-arrow-down', list.down)
    search.on('focus', () => list.style({ display: 'block' }))
    search.on('blur', (e: InputEvent) => {
        setTimeout(() => {
            list.style({ display: 'none' })
        }, 200)
    })
    search.on('input', (i: IInput<string>) => { list.filter(i.value, options.fields); list.style({ display: 'block' }) })
    list.on('item-selected', (value: any) => {
        base.emit('item-selected', value)
        search.setValue('')
        search.focus()
        list.style({ display: 'none' }, 100)
    })
    base.append(search, list)

    base.cssClass({
        position: 'relative',
    })

    return Object.assign(base, {
        fill(items: any[]) {
            list.fill(items)
        },
        exclude(item: string): void {
            list.exclude(item)
        },
        include(item: string): void {
            list.include(item)
        }
    })
}