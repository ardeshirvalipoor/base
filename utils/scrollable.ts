import { IBaseComponent } from '../components/base'
import { PASSIVE } from './passive-support'

export function Scrollable(base: IBaseComponent<any>) {

    base.el.addEventListener('scroll', onScroll, PASSIVE)
    const scrollOffset = 5;  // add a small offset
    // base.el.addEventListener('touchmove', onScroll, PASSIVE)
 function onScroll() {
        base.emit('scroll', Math.ceil(base.el.scrollTop), base.el.offsetHeight, base.el.scrollHeight)

        if (base.el.scrollHeight <= Math.ceil(base.el.scrollTop) + base.el.offsetHeight + scrollOffset) {
            base.emit('scrolled-end')
        }
        if (base.el.scrollTop == 0) {
            base.emit('scrolled-top')
        }
    }

    return Object.assign(base, {
        scrollToBottom() {
            base.el.scrollTop = base.el.scrollHeight
        }
    })
    // Todo: functional mentality?
    // Make it scrollable
}
