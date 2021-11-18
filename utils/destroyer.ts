import { IBase } from '../components/base'

export function destroyer<T extends HTMLElement>(base: IBase<T>) {
    return {
        // destroy() {
        //     // No base destroyer?
        //     base.children.map(child => child.destroy())
        //     base.listeners = []
        //     base.el.remove()
        //     // component.parent.children = component.parent.children.filter((child: any) => child != component)
        // },
        // empty() {
        //     base.children.map(child => child.destroy())
        //     base.children = []
        // }
    }
}

export interface IDestroyer {
    empty: () => void,
}