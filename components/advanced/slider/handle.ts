import { R, WH } from "../../../helpers/style"
import { Base } from "../../base"
import { ghostify } from "../ghost/ghost"

export const Handle = (direction = 'r') => {
    const base = Base()

    base.cssClass({
        ...WH(24),
        ...R(45),
        opacity: '.5',
        position: 'absolute',
        border: '1px solid gray',
        top: 'calc(50% - 13px)'
    })

    ghostify(base, {bg: '#00000055'})
    if (direction === 'r') {
        base.style({
            right: '-50px',
            borderBottom: 'none',
            borderLeft: 'none',
        })
    } else {
        base.style({
            left: '-50px',
            borderRight: 'none',
            borderTop: 'none'
        })
    }

    return base
}