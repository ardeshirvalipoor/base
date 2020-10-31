import { EASE, HIDE, ROUND, S, WH } from '../../../helpers/style'
import { Self } from '../../self'

export const Ghost = (options: IGhostOptions = {}) => {

    const self = Self()

    const opts = { opacity: .15, bg: '#000', size: 48, ...options }
    self.cssClass({
        ...HIDE,
        ...WH(opts.size),
        ...ROUND,
        backgroundColor: opts.bg,
        position: 'absolute',
        willChange: 'transform,opacity',
        transformOrigin: 'center',
        pointerEvents: 'none'
    })
    let touchStartTime = 0

    return {
        ...self,
        activate(x: number, y: number) {
            touchStartTime = new Date().valueOf()
            self.style({
                ...EASE(0),
                ...S(0),
                left: x - opts.size / 2 + 'px',
                top: y - opts.size / 2 + 'px',
            })
            self.style({
                ...EASE(.16),
                ...S(2),
                opacity: opts.opacity + ''
            }, 10)
        },
        deactivate() {
            self.style({
                ...EASE(.5),
                ...HIDE,
            }, 500 - new Date().valueOf() + touchStartTime)
        }
    }
}


interface IGhostOptions {
    size?: number,
    opacity?: number,
    bg?: string
}

