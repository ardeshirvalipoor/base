import { EASE, HIDE, ROUND, S, WH } from '../../../helpers/style'
import { PASSIVE } from '../../../utils/passive-support'
import { CS } from '../../../utils/styler'
import { IBaseComponent, Base } from '../../base'

export const Ghost = (options = <IGhostOptions>{}) => {

    const base = Base('div')

    const opts = { opacity: .15, bg: '#00000055', bgDark: '#ffffff', size: 48, ...options }
    base.cssClass({
        ...HIDE,
        ...WH(opts.size),
        ...ROUND,
        backgroundColor: opts.bg,
        position: 'absolute',
        willChange: 'transform,opacity',
        transformOrigin: 'center',
        pointerEvents: 'none',
        '&.dark': {
            backgroundColor: opts.bgDark ,
        }
    })
    let touchStartTime = 0

    return Object.assign(
        base,
        {
            activate(x: number, y: number) {
                touchStartTime = new Date().valueOf()
                base.style({
                    ...EASE(0),
                    ...S(0),
                    left: x - opts.size / 2 + 'px',
                    top: y - opts.size / 2 + 'px',
                })
                base.style({
                    ...EASE(.12),
                    ...S(2),
                    opacity: opts.opacity + ''
                }, 5)
            },
            deactivate() {
                base.style({
                    ...EASE(.36),
                    ...HIDE,
                    ...S(3),
                }, 100 - new Date().valueOf() + touchStartTime)
            }
        }
    )
}

export const ghostify = (c: IBaseComponent<'div'>, options: IGhostOptions = {}) => {
    const ghost = Ghost(options)
    const opts = {
        activeStyle: { /* ...S(.96) */
            filter: 'brightness(0.9)'
        }, normalStyle: { /* ...S(1) */ filter: '' }, ...options
    }
    c.el.addEventListener('touchstart', (e) => {
        const { x, y } = c.el.getBoundingClientRect()
        const { pageX, pageY } = e.touches[0]
        ghost.activate(pageX - x, pageY - y)
        c.style(opts.activeStyle)
    }, PASSIVE)
    c.el.addEventListener('touchend', () => {
        ghost.deactivate()
        // c.style(opts.normalStyle)
    }, PASSIVE)
    c.el.addEventListener('touchcancel', () => {
        ghost.deactivate()
        // c.style(opts.normalStyle)
    }, PASSIVE)
    c.append(ghost)
}
interface IGhostOptions {
    size?: number,
    opacity?: number,
    bg?: string,
    bgDark?: string,
    activeStyle?: CS,
    normalStyle?: CS
}

