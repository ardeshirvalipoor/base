import { Base, IBaseComponent } from "../../base";
import { Span } from "../../native/span";
// Todo: remove this component
export const SelectItem = (item: ISelectListItem<string>) => {
    
    const base = <ISelectListItemComponent<string>>Base('li')

    return Object.assign(
        base,
        {
            select() {
                base.style({
                    backgroundColor: '#f7fefe',
                })
            },
            deselect() {
                base.style({
                    backgroundColor: ''
                })
            },
            getValue() {
                return item.value
            }
        }
    )
}

export interface ISelectListItemComponent<T> extends IBaseComponent<any> {
    select: () => void,
    deselect: () => void,
    getValue: () => T
}
export interface ISelectListItem<T> {
    title: string,
    value: T
}