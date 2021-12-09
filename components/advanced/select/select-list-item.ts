import { IBaseComponent } from "../../base"
import { Div } from "../../native/div"

export const SelectListItem = (base: IBaseComponent<any>) => {

    return Object.assign(
        base,
        {
            select() {
                base.style({ backgroundColor: '#eee' })
            },
            deselect() {
                base.style({ backgroundColor: '#fff' })
            }
        }
    )
}

export interface ISelectItem extends IBaseComponent<any> {
    select: Function,
    deselect: Function,
}