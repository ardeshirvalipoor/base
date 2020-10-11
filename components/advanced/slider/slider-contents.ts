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
                ...EASE(options.smooth ? .44 : 0),
                ...X(x)
            })
        },
        reset() {
            self.style({
                ...EASE(0),
                ...X(0)
            })
        }
    }
}

export interface ISlideFunction {
    smooth?: boolean
}