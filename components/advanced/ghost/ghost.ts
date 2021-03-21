import { EASE, HIDE, ROUND, S, WH } from '../../../helpers/style'
import { PASSIVE } from '../../../utils/passive-support'
import { CS } from '../../../utils/styler'
import { ISelf, Self } from '../../self'

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
                ...EASE(.12),
                ...S(2),
                opacity: opts.opacity + ''
            }, 5)
        },
        deactivate() {
            self.style({
                ...EASE(.36),
                ...HIDE,
                ...S(3),
            }, 100 - new Date().valueOf() + touchStartTime)
        }
    }
}

export const ghostify = (c: ISelf<HTMLDivElement>, options: IGhostOptions = {}) => {
    const ghost = Ghost(options)
    const opts = { activeStyle: { /* ...S(.96) */
        filter: 'brightness(0.9)' }, normalStyle: { /* ...S(1) */ filter: ''}, ...options }
    c.el.addEventListener('touchstart', (e) => {
        const { x, y } = c.el.getBoundingClientRect()
        const { pageX, pageY } = e.touches[0]
        ghost.activate(pageX - x, pageY - y)
        c.style(opts.activeStyle)
    }, PASSIVE)
    c.el.addEventListener('touchend', () => {
        ghost.deactivate()
        c.style(opts.normalStyle)
    }, PASSIVE)
    c.el.addEventListener('touchcancel', () => {
        ghost.deactivate()
        c.style(opts.normalStyle)
    }, PASSIVE)
    c.append(ghost)
}
interface IGhostOptions {
    size?: number,
    opacity?: number,
    bg?: string,
    activeStyle?: CS,
    normalStyle?: CS
}

