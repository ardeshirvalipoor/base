import { ABSOLUTE, EASE } from "../../../helpers/style"
import { Div } from "../../native/div"

export const Ripple = (options: { color?: string } = {}) => {

    const base = Div()
    base.cssClass({
        ...ABSOLUTE,
    })

    const ripple = Div()
    ripple.cssClass({
        ...ABSOLUTE,
        ...EASE(.3),
        borderRadius: '50%',
        backgroundColor: options.color || '#000',
        transform: 'scale(0)',
        opacity: '0.3',
        pointerEvents: 'none',
    })
    base.append(ripple)

    base.el.addEventListener('touchstart', (e: TouchEvent) => {
        const rect = base.el.getBoundingClientRect()
        const x = e.touches[0].clientX - rect.left
        const y = e.touches[0].clientY - rect.top

        const size = Math.max(rect.width, rect.height) * 2
        const halfSize = size / 2

        ripple.style({
            width: size + 'px',
            height: size + 'px',
            left: x - halfSize + 'px',
            top: y - halfSize + 'px',
            transform: 'scale(1)',
        })

        ripple.style({
            transform: 'scale(0)',
        }, 300)

    })


    return base

}