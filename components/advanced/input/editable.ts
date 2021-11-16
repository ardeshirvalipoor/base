import { editable } from '../../../utils/editable'
import { Base } from '../../base'

export const Editable = (options: any = {}) => {

    const base = Base()
    base.el.contentEditable = 'true'
    base.el.dir = 'auto'
    base.el.addEventListener('input', () => {
        base.emit('input')
    })
    base.cssClass({
        pointerEvents: 'all',
        userSelect: 'text', // IOS
        overflow: 'scroll',
        maxHeight: (options.maxHeight || 100) + 'px'
        // height: '100%'
    })


    return Object.assign(
        base,
        editable(base)
    )
}