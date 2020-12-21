import { X } from '../../../helpers/style'
import { Self } from '../../self'
import { SliderContents } from './slider-contents'

export const Slider = (items: any[], options: ISlideOptions = {}) => {
    let W = 0
    let index = 0
    let acc = {}
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

    self.mounted = () => {
        W = options.width || self.el.getBoundingClientRect().width
        items.forEach((slide, i) => {
            slides.push(slide)
            container.append(slide)
            slide.style(X((options.direction == 'rtl' ? W : -W) * i))
            slide.requestNext = (v: any) => {
                acc = { ...acc, ...v }
                if (index == items.length - 1) {
                    self.emit('done', acc)
                } else {
                    next()
                }
            }
            slide.requestPrev = () => prev()
            slide.requestReset = () => reset()
        })
        slides[0].onEnter()
    }

    let ox = 0
    let x = 0
    let tx = 0
    self.el.addEventListener('touchstart', (e: TouchEvent) => {
        tx = 0
        ox = e.touches[0].pageX
    })
    self.el.addEventListener('touchmove', (e: TouchEvent) => {
        if (!options.touchable) return
        tx = e.touches[0].pageX - ox
        container.slide(tx + x)
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
            if (x == (slides.length - 1) * W) dx = 0
            else dx = -(options.direction == 'rtl' ? W : -W)
        }
        if (dt < -60) {
            if (x == 0) dx = 0
            else dx = (options.direction == 'rtl' ? W : -W)
        }
        container.slide(x += dx, { smooth: true })
        index = Math.abs(Math.round(x / W))
        slides[index].onEnter()
    }

    function next() {
        move(options.direction == 'rtl' ? W : -W)
    }

    function prev() {
        move(options.direction == 'rtl' ? -W : W)
    }

    function reset(delay = 0) {
        setTimeout(() => {
            index = 0
            x = 0
            container.reset(delay)
            slides.map(slide => slide.reset())
        }, delay)
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
            slide.requestNext = (value: any) => { slide.resolve(value); next() }
            slide.requestPrev = () => prev()
            slide.requestReset = () => reset()
        },
        clear() {
            slides = [slides[0]] // Todo: fix
            container.children.map((child, i) => i > 0 ? child.destroy() : null)
            reset()
        },
        enter() {
            slides[0].onEnter()
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