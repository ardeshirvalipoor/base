import { PASSIVE } from '../../../utils/passive-support'
import { Base } from '../../base'

export function List<U>() {
    const base = Base('ul')
    let height = 0
    base.on('mounted', () => {
        height = base.el.getBoundingClientRect().height
    })

    base.el.addEventListener('scroll', () => {
        base.emit('scroll', base.el.scrollTop)
        if (base.el.scrollHeight <= base.el.scrollTop + height) {
            base.emit('scrolled-end')
        }
        if (base.el.scrollTop == 0) {
            base.emit('scrolled-top')
        }
    }, PASSIVE)

    base.style({
        margin: '0',
        overflow: 'scroll'
    })

    // Todo: functional mentality?
    // Make it scrollable
    

    return base
}