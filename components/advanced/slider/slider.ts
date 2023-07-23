import { HIDE, SHOW, X } from '../../../helpers/style'
import { PASSIVE } from '../../../utils/passive-support'
import { Base, IBaseComponent } from '../../base'
import { Div } from '../../native/div'
import { Handle } from './handle'
import { SliderContents } from './slider-contents'

export const Slider = (slides: IBaseComponent<any>[], options: ISlideOptions = {}) => {

    let W = 0
    let index = 0
    const base = Base()
    const container = SliderContents()
    const handleR = Handle('r')
    const handleL = Handle('l')
    handleR.el.onclick = next
    handleL.el.onclick = prev
    base.append(container, handleR, handleL)

    base.on('mounted', () => {
        W = options.width || base.el.getBoundingClientRect().width
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

    let ox = 0
    let x = 0
    let tx = 0
    base.el.addEventListener('touchstart', (e: TouchEvent) => {
        tx = 0
        ox = e.touches[0].pageX
    }, PASSIVE)
    base.el.addEventListener('touchmove', (e: TouchEvent) => {
        if (!options.touchable) return
        tx = e.touches[0].pageX - ox
        container.move(tx + x)
    })
    base.el.addEventListener('touchend', () => {
        if (!options.touchable) return
        move()
    })
    base.el.addEventListener('touchcancel', () => {
        if (!options.touchable) return
        move()
    })

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
        handleL.style({ display: 'block' })
        handleR.style({ display: 'block' })
        if (index == slides.length - 1) {
            handleL.style({ display: 'none' })
        }
        if (index == 0) {
            handleR.style({ display: 'none' })
        }
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

    base.cssClass({
        position: 'relative',
        width: '100%',
        height: '100%'
    })
    container.style({
        position: 'relative',
        // overflow: 'hidden',
        width: '100%',
        height: '100%'
    })


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