import { editable } from '../../../utils/editable'
import { Base } from '../../base'

export const Editable = (options: any = {}) => {
    let t : NodeJS.Timeout

    const base = Base('div')
    base.el.contentEditable = 'true'
    base.el.dir = 'auto'
    base.el.addEventListener('input', () => {
        base.emit('typing')
        if (options.timeout === undefined) return base.emit('input')
        clearTimeout(t)
        t = setTimeout(() => base.emit('input'), options.timeout ?? 500) // Todo: use debounce
    })
    base.el.addEventListener('paste', (e) => {
        e.preventDefault()
        base.emit('paste', e)
    })
    // Input debounce
    // https://medium.com/@joshua_e_steele/debouncing-and-throttling-in-javascript-b01cad5d6dcf
    //
    // const debounce = (func: any, wait: number) => {
    //     let timeout: any
    //     return function (...args: any[]) {
    //         const context = this
    //         const later = () => {
    //             timeout = null
    //             func.apply(context, args)
    //         }
    //         clearTimeout(timeout)
    //         timeout = setTimeout(later, wait)
    //     }
    // }
    //
    // const debounced = debounce(() => {
    //     console.log('debounced')
    // }, 500)
    //
    // base.el.addEventListener('input', debounced)

    base.cssClass({
        // pointerEvents: 'inherit',
        userSelect: 'text', // IOS
        overflow: 'auto',
        overflowX: 'hidden',
        // height: '100%'
    })


    return Object.assign(
        base,
        editable(base)
    )
}