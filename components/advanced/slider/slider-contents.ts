import { EASE, X } from '../../../helpers/style'
import { Base } from '../../base'
import { Div } from '../../native/div'

export const SliderContents = () => {

    const base = Div()
    base.cssClass({
        position: 'relative',
        height: '100%',
        width: '100%',
    })

    function move(x: number, options: ISlideFunction = {}) {
        base.style({
            ...EASE(options.smooth ? .3 : 0, 'all', 'ease-in-out'),
            // ...EASE(options.smooth ? .5 : 0, 'all', 'cubic-bezier(0.22, 0.73, 0.46, 1)'),
            ...X(x),
        })
    }

    function reset(delay: number) {
        base.style({
            ...EASE(0),
            ...X(0)
        }, delay)
    }

    return Object.assign(
        base,
        {
            move, 
            reset
        }
    )
}

export interface ISlideFunction {
    smooth?: boolean
}