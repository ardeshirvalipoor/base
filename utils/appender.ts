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
        getChildren() {
            return children
        },
        setChildren(c: IBaseComponent<any>[]) {
            children = c
        },
        append(...args) {
            for (const c of args) {
                if (c === false) continue
                base.el.appendChild(c.el)
                children.push(c)
                c.parent = base
            }
            return base
        },
        appendBefore(component: IBaseComponent<any>, ...args) {
            for (const c of args) {
                base.el.insertBefore(c.el, component.el)
                const index = children.indexOf(component)
                children.splice(index, 0, c)
                c.parent = base
            }
            return base
        },
        appendAfter(component: IBaseComponent<any>, ...args) {
            for (const c of args) {
                base.el.insertBefore(c.el, component.el.nextSibling)
                const index = children.indexOf(component)
                children.splice(index + 1, 0, c)
                c.parent = base
            }
            return base
        },
        prepend(...args) {
            for (const c of args) {
                base.el.insertBefore(c.el, base.el.childNodes[0])
                children.unshift(c)
                c.parent = base
            }
            return base
        },
        remove() {
            children.forEach(child => child.remove())
            base.parent?.setChildren(base.parent.getChildren().filter(c => c !== base))
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
    children: IBaseComponent<any>[],
    getChildren: () => IBaseComponent<any>[]
    setChildren: (children: IBaseComponent<any>[]) => void,
    append: (...args: (IBaseComponent<any> | false)[]) => IBaseComponent<any>,
    prepend: (...args: IBaseComponent<any>[]) => void,
    appendBefore: (component: IBaseComponent<any>, ...args: IBaseComponent<any>[]) => void,
    appendAfter: (component: IBaseComponent<any>, ...args: IBaseComponent<any>[]) => void,
    empty: () => void,
    remove: () => void,
}