import { IBase } from "../../base"
import { Div } from "../../native/div"

export const SelectListItem = (base: IBase) => {

    return Object.assign(
        base,
        {
            select() {
                base.style({ backgroundColor: '#ccc' })
            },
            deselect() {
                base.style({ backgroundColor: '#fff' })
            }
        }
    )
}

export interface ISelectItem extends IBase {
    select: Function,
    deselect: Function,
}