import { IBase, ISelf } from '../components/base'

export function Scrollable(base: ISelf<HTMLElement>) {
    let height = 0
    base.on('mounted', () => {
        height = base.el.getBoundingClientRect().height
    })

    base.el.addEventListener('scroll', () => {
        base.emit('scroll', base.el.scrollTop)
        if (base.el.scrollHeight <= base.el.scrollTop + height) {
            base.emit('scrolled-to-end')
        }
        if (base.el.scrollTop == 0) {
            base.emit('scrolled-to-top')
        }
    })

    // Todo: functional mentality?
    // Make it scrollable


    return base
}