import { EASE, HIDE, ROUND, S, WH } from '../../../helpers/style'
import { PASSIVE } from '../../../utils/passive-support'
import { CS } from '../../../utils/styler'
import { IBaseComponent } from '../../base'
import { Div } from '../../native/div'

export const Ghost = (options = <IGhostOptions>{}) => {

    const base = Div()

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
        '&:dark': {
            backgroundColor: opts.bgDark || opts.bg,
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
                    // animation: 'ghost 2s',
                    opacity: '1',
                    left: x - opts.size / 2 + 'px',
                    top: y - opts.size / 2 + 'px',
                })

                base.style({
                    transition: 'all 1s cubic-bezier(0, 1, 0, 1)',
                    ...S(3.5),
                    opacity: '.3'
                }, 10)

                base.style({
                    transition: 'all 2s cubic-bezier(0, 1, 0, 1)',
                    ...S(3.5),
                    opacity: '0'
                }, 500)
            },
            deactivate() {
                base.style({
                    ...S(2),
                })
                base.style({
                    ...EASE(.36),
                    ...HIDE,
                    ...S(3),
                }, 100 - new Date().valueOf() + touchStartTime)
            }
        }
    )
}

export const withRipple = (c: IBaseComponent<any>, options: IGhostOptions = {}) => {
    const ghost = Ghost(options)
    c.el.addEventListener('touchstart', (e: TouchEvent) => {
        const { x, y } = c.el.getBoundingClientRect()
        const { pageX, pageY } = e.touches[0]
        ghost.activate(pageX - x, pageY - y)
        // setTimeout(() => {
        //     ghost.deactivate()
        // }, 10);
        // c.style(opts.activeStyle)
    }, PASSIVE)
    c.el.addEventListener('touchend', () => {
        // ghost.deactivate()
        // c.style(opts.normalStyle)
    }, PASSIVE)
    c.el.addEventListener('touchcancel', () => {
        // ghost.deactivate()
        // c.style(opts.normalStyle)
    }, PASSIVE)
    c.append(ghost)

    return c
}
interface IGhostOptions {
    size?: number,
    opacity?: number,
    bg?: string,
    bgDark?: string,
    activeStyle?: CS,
    normalStyle?: CS
}

