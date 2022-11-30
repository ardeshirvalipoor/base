import { IBaseComponent, IBaseSVGComponent } from '../interfaces/base'
import ldb from '../lib/ldb'
import emitter from './emitter'
import { observe } from "./mounter"

export default (base: IBaseComponent<any> | IBaseSVGComponent<any>): IAppender => {
    let children: IBaseComponent<any>[] = []
    const o = observe(base.el)
    o.on('mutate', (id: string) => {
        const found = children.find(c => c.id === id)
        found?.emit('mounted', id)
    })

    // .then(nodes => {
    // nodes.forEach(node => {
    //     const id = node?.getAttribute('data-base-id')
    //     const found = children.find(c => c.id === id)
    //     found?.emit('mounted', id)
    // })
    // })

    return {
        children,
        append(...args) {
            for (const c of args) {
                base.el.appendChild(c.el)
                children.push(c)
            }
            return base
        },
        appendBefore(component: IBaseComponent<any>, ...args) {
            for (const c of args) {
                base.el.insertBefore(c.el, component.el)
                children.unshift(c) // Todo: check if this is correct
            }
            return base
        },
        prepend(...args) {
            for (const c of args) {
                base.el.insertBefore(c.el, base.el.childNodes[0])
                children.unshift(c)
            }
            return base
        },
        remove() {
            children.forEach(child => child.remove())
            base.removeAllListeners()
            base.el.remove()
        },
        empty() {
            children.forEach(child => child.remove())
            children = []
        },
    }
}

export interface IAppender {
    children: IBaseComponent<any>[]
    append: (...args: IBaseComponent<any>[]) => IBaseComponent<any>,
    prepend: (...args: IBaseComponent<any>[]) => void,
    appendBefore: (component: IBaseComponent<any>, ...args: IBaseComponent<any>[]) => void,
    empty: () => void,
    remove: () => void,
}