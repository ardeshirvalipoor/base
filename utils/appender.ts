import { ISelf, IBase } from '../components/base'
import { elements } from './elements-db'

export function appender<T extends HTMLElement, U>(base: ISelf<T, U>) {
    // let children: any[] = []
    return {
        // children,
        // append(...args: ISelf<T>[]) {
        //     for (const component of args) {
        //         const c = /* await */ component
        //         elements[c.id] = c //els db
        //         base.el.appendChild(c.el)
        //         base.children.push(c)
        //         c.parent = base // should pass a base
        //     }
        // },
        // prepend(...args: ISelf<T>[]) {
        //     args.map(async component => {
        //         const c = /* await */ component
        //         elements[c.id] = c
        //         base.el.insertBefore(c.el, base.el.childNodes[0])
        //         base.children.unshift(c)
        //         c.parent = base // should pass a base
        //     })
        // },
        // empty2() {
        //     children.map(child => child.destroy2())
        //     children = []
        //     console.log('in empty2', { base }, children)

        // },
        // destroy2() {
        //     // No base destroyer?
        //     children.map(child => child.destroy2())
        //     // listeners = []
        //     base.el.remove()
        //     // component.parent.children = component.parent.children.filter((child: any) => child != component)
        // },
    }
}
