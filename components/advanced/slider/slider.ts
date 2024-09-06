import { HIDE, SHOW, X } from '../../../helpers/style'
import { PASSIVE } from '../../../utils/passive-support'
import { Base, IBaseComponent } from '../../base'
import { Handle } from './handle'
import { SliderContents } from './slider-contents'

export const Slider = (slides: IBaseComponent<any>[], options: ISlideOptions = {}) => {

    const base = Base()
    base.cssClass({
        position: 'relative',
        width: '100%',
        height: '100%'
    })

    const container = SliderContents()
    container.style({
        position: 'relative',
        width: '100%',
        height: '100%'
    })
    base.append(container)

    const handleR = Handle('r')
    const handleL = Handle('l')

    let W = 0
    let index = 0
    base.on('mounted', () => {
        W = base.el.parentElement?.clientWidth || 0
        slides.forEach((slide, i) => {
            container.append(slide)
            slide.style(X((options.direction == 'r' ? -W : W) * i))
            slide.on('next', () => {
                if (index == slides.length - 1) {
                    base.emit('done')
                } else {
                    next()
                }
            })
            slide.on('prev', prev)
        })
    })

    if (options.touchable) {
        base.el.addEventListener('touchstart', handleTouchStart, PASSIVE)
        base.el.addEventListener('touchmove', handleTouchMove, PASSIVE)
        base.el.addEventListener('touchend', handleTouchEnd, PASSIVE)
        base.el.addEventListener('touchcancel', handleTouchCancel, PASSIVE)
    }
    container.el.addEventListener('transitionend', handleTransitionEnd)
    function handleTransitionEnd() {
    }

    let tx = 0
    let dy = 0
    let ox = 0
    let oy = 0
    let x = 0

    function handleTouchStart(e: TouchEvent) {
        tx = 0
        ox = e.touches[0].pageX
        oy = e.touches[0].pageY
    }

    function handleTouchMove(e: TouchEvent) {
        tx = e.touches[0].pageX - ox
        dy = e.touches[0].pageY - oy
        if (Math.abs(tx) < 10) return
        if (dy > tx) {
            // tx = 0
        }
        container.move(tx + x)
    }

    function handleTouchEnd(e: TouchEvent) {
        move()
    }

    function handleTouchCancel(e: TouchEvent) {
        move()
    }

    function move(dt = tx) {
        let dx = 0
        if (dt > 60) {
            if (index === 0 && options.direction === 'l' || index === slides.length - 1 && options.direction === 'r') dx = 0
            else dx = W
        }
        if (dt < -60) {
            if (index === slides.length - 1 && options.direction === 'l' || index === 0 && options.direction === 'r') dx = 0
            else dx = -W
        }
        container.move(x += dx, { smooth: true })
        index = Math.abs(Math.round(x / W))
        if (options.showHandles) {
            handleL.show()
            handleR.show()
            if (index == slides.length - 1) {
                handleL.hide()
            }
            if (index == 0) {
                handleR.hide()
            }
        }
        setTimeout(() => {
            base.emit('slide', index)
        }, 160);
    }

    function next() {
        move(options.direction == 'r' ? W : -W)
    }

    function prev() {
        move(options.direction == 'r' ? -W : W)
    }

    function reset(delay = 0) {
        setTimeout(() => {
            index = 0
            x = 0
            container.reset(delay)
        }, delay)
    }

    // todo fix later
    if (options.showHandles) {
        base.append(handleR, handleL)
        if (options.direction === 'r') {
            handleL.show()
            handleR.el.onclick = prev
            handleL.el.onclick = next
        } else {
            handleR.show()
            handleR.el.onclick = next
            handleL.el.onclick = prev
        }
    }

    return Object.assign(
        base,
        {
            reset,
            next,
            prev,
        }
    )
}

interface ISlideOptions {
    infinite?: boolean,
    showDots?: boolean,
    showHandles?: boolean,
    direction?: string,
    width?: number,
    height?: number,
    touchable?: boolean
}