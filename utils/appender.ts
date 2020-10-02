import { ISelf, IBase } from '../components/self'
import { elements } from './elements-db'

export function appender<T extends HTMLElement>(base: ISelf<T>) {
    return {
        async append(...args: ISelf<T>[]) {
            for (const component of args) {
                const c = await component
                elements[c.id] = c //els db
                base.el.appendChild(c.el)
                base.children.push(c)
                c.parent = base // should pass a base
            }
        },
        prepend(...args: ISelf<T>[]) {
            args.map(async component => {
                const c = await component
                elements[c.id] = c
                base.el.insertBefore(c.el, base.el.childNodes[0])
                base.children.unshift(c)
                c.parent = base // should pass a base
            })
        },
    }
}
