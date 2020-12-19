import { EASE, X } from '../../../helpers/style'
import { Self } from '../../self'

export const SliderContents = () => {
    const self = Self()

    self.cssClass({
        position: 'relative',
        height: '100%'
    })

    return {
        ...self,
        slide(x: number, options: ISlideFunction = {}) {
            self.style({
                ...EASE(options.smooth ? .5 : 0, 'all', 'cubic-bezier(0.22, 0.73, 0.46, 1)'),
                ...X(x),
            })
        },
        reset(delay: number) {
            self.style({
                ...EASE(0),
                ...X(0)
            }, delay)
        }
    }
}

export interface ISlideFunction {
    smooth?: boolean
}