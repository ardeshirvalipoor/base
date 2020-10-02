import { ISelf, IBase } from '../components/self'

export function destroyer<T extends HTMLElement>(base: IBase<T>) {
    return {
        destroy() {
            // No self destroyer?
            base.children.map(child => child.destroy())
            base.listeners = []
            base.el.remove()
            // component.parent.children = component.parent.children.filter((child: any) => child != component)
        },
        empty() {
            base.children.map(child => child.destroy())
        }
    }
}