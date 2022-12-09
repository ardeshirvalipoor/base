import { EASE, X } from '../../../helpers/style'
import { Base } from '../../base'
import { Div } from '../../native/div'

export const SliderContents = () => {

    const base = Div()
    base.cssClass({
        position: 'relative',
        height: '100%',
        width: '100%',
        // overflow: 'hidden',
    })

    return Object.assign(
        base,
        {
            move(x: number, options: ISlideFunction = {}) {
                base.style({
                    ...EASE(options.smooth ? .5 : 0, 'all', 'cubic-bezier(0.22, 0.73, 0.46, 1)'),
                    ...X(x),
                })
            },
            reset(delay: number) {
                base.style({
                    ...EASE(0),
                    ...X(0)
                }, delay)
            }
        }
    )
}

export interface ISlideFunction {
    smooth?: boolean
}