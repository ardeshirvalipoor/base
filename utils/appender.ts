import { IBaseComponent, IBaseSVGComponent } from "../components/base";
import { observe } from "./mounter";

export default (base: IBaseComponent<any> | IBaseSVGComponent<any>): IAppender => {
    let children: IBaseComponent<any>[] = []
    observe(base.el).then(nodes => {
        nodes.forEach(node => {
            const id = node?.getAttribute('data-base-id')
            const found = children.find(c => c.id === id)
            found?.emit('mounted', id)
        })
    })

    return {
        children,
        append(...args) {
            for (const c of args) {
                base.el.appendChild(c.el)
                children.push(c)
            }
        },
        appendBefore(component: IBaseComponent<any>, ...args) {
            for (const c of args) {
                base.el.insertBefore(c.el, component.el)
                children.unshift(c) // Todo: check if this is correct
            }
        },
        prepend(...args) {
            for (const c of args) {
                base.el.insertBefore(c.el, base.el.childNodes[0])
                children.unshift(c)
            }
        },
        destroy() {
            children.forEach(child => child.destroy())
            base.removeAllListeners()
            base.el.remove()
        },
        empty() {
            children.forEach(child => child.destroy())
            children = []
        },
    }
}

export interface IAppender {
    children: IBaseComponent<any>[]
    append: (...args: IBaseComponent<any>[]) => void,
    prepend: (...args: IBaseComponent<any>[]) => void,
    appendBefore: (component: IBaseComponent<any>, ...args: IBaseComponent<any>[]) => void,
    empty: () => void,
    destroy: () => void,
}