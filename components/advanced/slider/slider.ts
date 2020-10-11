import { EASE, X } from '../../../helpers/style'
import { Self } from '../../self'
import { SliderContents } from './slider-contents'

export const Slider = (items: any[], options: ISlideOptions = {}) => {
    const W = options.width || window.innerWidth

    // const { width, height } = options
    let slides: any[] = []
    const self = Self()
    const container = SliderContents()
    self.append(container)

    self.cssClass({
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%'
    })


    items.forEach((slide, i) => {
        slides.push(slide)
        container.append(slide)
        slide.style(X(-W * i))
        slide.requestNext  = () => next()
        slide.requestPrev  = () => prev()
        slide.requestReset = () => reset()
    })

    let ox = 0
    let containerX = 0
    let tx = 0
    self.el.addEventListener('touchstart', (e: TouchEvent) => {
        tx = 0
        ox = e.touches[0].pageX
    })
    self.el.addEventListener('touchmove', (e: TouchEvent) => {
        if (!options.touchable) return
        tx = e.touches[0].pageX - ox
        container.slide(tx + containerX)
    })
    self.el.addEventListener('touchend', () => {
        if (!options.touchable) return
        move()
    })
    self.el.addEventListener('touchcancel', () => {
        if (!options.touchable) return
        move()
    })
    function move(dt = tx) {
        let dx = 0
        if (dt > 60) {
            if (containerX == (slides.length - 1) * W) dx = 0
            else dx = W
        }
        if (dt < -60) {
            if (containerX == 0) dx = 0
            else dx = -W
        }
        container.slide(containerX += dx, {smooth: true})
        const index = Math.round(containerX/W)
        if('onEnter' in slides[index]) slides[index].onEnter()
    }

    function next() {
        move(W)
    }
    function prev() {
        move(-W)
    }
    function reset() {
        containerX = 0
        container.reset()
    }

    return {
        ...self,
        reset,
        next,
        prev,
        add(slide: any) {
            slides.push(slide)
            container.append(slide)
            slide.style(X(-W * (slides.length - 1)))
            slide.requestNext = () => next()
            slide.requestPrev = () => prev()
            slide.requestReset = () => reset()
        },
        clear() {
            slides = [slides[0]] // Todo: fix
            container.children.map((child, i) => i > 0 ? child.destroy(): null)
            reset()
        }
    }
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