import { IBaseComponent, IBaseSVGComponent } from "../components/base";

export default (base: IBaseComponent<any> | IBaseSVGComponent<any>): IAppender => ({
    children: [],
    append(...args) {
        for (const c of args) {
            base.el.appendChild(c.el)
            base.children.push(c)
        }
    },
    prepend(...args) {
        for (const c of args) {
            base.el.insertBefore(c.el, base.el.childNodes[0])
            base.children.unshift(c)
        }
    },
    destroy() {
        base.children.forEach(child => child.destroy())
        base.removeAllListeners()
        base.el.remove()
    },
    empty() {
        base.children.forEach(child => child.destroy())
        base.children = []
    },
})




export interface IAppender {
    children: IBaseComponent<any>[]
    append: (...args: IBaseComponent<any>[]) => void,
    prepend: (...args: IBaseComponent<any>[]) => void,
    empty: () => void,
    destroy: () => void,
}