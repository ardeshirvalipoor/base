import { IBaseComponent } from '../components/base'
import emitter from './emitter'
import { PASSIVE } from './passive-support'

export function Scrollable(base: IBaseComponent<any>) {
    let height = 0
    base.on('mounted', (id: string) => {
        if (id === base.id) {
            height = base.el.getBoundingClientRect().height
        }
    })

    base.el.addEventListener('scroll', () => {
        base.emit('scroll', base.el.scrollTop)
        if (base.el.scrollHeight <= base.el.scrollTop + height) {
            base.emit('scrolled-to-end')
        }
        if (base.el.scrollTop == 0) {
            base.emit('scrolled-to-top')
        }
    }, PASSIVE)

    return Object.assign(base, {
        scrollToBottom() {
            base.el.scrollTop = base.el.scrollHeight
        }
    })
    // Todo: functional mentality?
    // Make it scrollable
}