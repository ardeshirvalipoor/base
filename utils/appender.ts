
import { IBaseComponent, IBaseSVGComponent } from '../components/base'
import { emitter } from './emitter'

export default (base: IBaseComponent<any> | IBaseSVGComponent<any>): IAppender => {
    let children: IBaseComponent<any>[] = []

    const validateComponent = (c: any) => {
        if (!c || !c.el || typeof c.el.appendChild !== 'function') {
            throw new Error(`Invalid component: ${c}`)
        }
    }

    emitter.on('mutate', (node) => {
        if (node.contains(base.el) && !base.isMounted) {
            base.isMounted = true;
            base.emit('mounted')
        }
    })

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
                // check if c is async
                if (c instanceof Promise) {
                    c.then((c) => {
                        validateComponent(c)
                        base.el.appendChild(c.el)
                        children.push(c)
                        c.parent = base
                    })
                    continue
                }
                validateComponent(c)
                if (c === false) continue
                base.el.appendChild(c.el)
                children.push(c)
                c.parent = base
            }
            base.emit('append', args)
            return base
        },
        appendBefore(component: IBaseComponent<any>, ...args) {
            for (const c of args) {
                validateComponent(c)
                base.el.insertBefore(c.el, component.el)
                const index = children.indexOf(component)
                children.splice(index, 0, c)
                c.parent = base
            }
            base.emit('appendBefore', component, args)
            return base
        },
        appendAfter(component: IBaseComponent<any>, ...args) {
            for (const c of args) {
                validateComponent(component)
                base.el.insertBefore(c.el, component.el.nextSibling)
                const index = children.indexOf(component)
                children.splice(index + 1, 0, c)
                c.parent = base
            }
            base.emit('appendAfter', component, args)
            return base
        },
        prepend(...args) {
            for (const c of args) {
                validateComponent(c)
                base.el.insertBefore(c.el, base.el.childNodes[0])
                children.unshift(c)
                c.parent = base
            }
            base.emit('prepend', args)
            return base
        },
        remove() {
            children.forEach(child => child.remove())
            base.parent?.setChildren(base.parent.getChildren().filter(c => c !== base))
            base.removeAllListeners()
            base.el.remove()
            base.emit('unmounted')
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
    prepend: (...args: IBaseComponent<any>[]) => IBaseComponent<any>,
    appendBefore: (component: IBaseComponent<any>, ...args: IBaseComponent<any>[]) => IBaseComponent<any>,
    appendAfter: (component: IBaseComponent<any>, ...args: IBaseComponent<any>[]) => IBaseComponent<any>,
    empty: () => void,
    remove: () => void,
}