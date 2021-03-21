import { styler, CS, IStyleOptions } from '../utils/styler'
import { destroyer } from '../utils/destroyer'
import { appender } from '../utils/appender'
import { nextId } from '../utils/id-generator'
import emitter from '../utils/emitter'

export function Self<T extends HTMLElement = HTMLDivElement, U = ISelf<T, any>>(type: string = 'div'): ISelf<T, U> {
    const id = 'core-' + nextId()
    const base: IBase<T, U> = {
        el: type == 'svg' ? document.createElementNS('http://www.w3.org/2000/svg', 'svg') : <T>document.createElement(type),
        children: [],
        listeners: [], // Todo: do we need this?
        parent: null,
        mounted() { },
        id
    }
    base.el.setAttribute('id', id)

    return {
        ...base,
        ...styler(base),
        ...appender<T>(base),
        ...destroyer<T>(base),
        ...emitter()
    }
}

export interface IBase<T, U = any> {
    el: T | SVGElement,
    listeners: any[]
    children: U[]
    parent?: ISelf<T, U> | null
    id: string
    mounted: () => void
}
export interface ISelf<T, U = any> extends IBase<T, U> {
    append: Function // a => component
    prepend: Function
    destroy: () => void,
    empty: () => void,
    cssClass: (style: CS) => void
    style: (style: CS, options?: IStyleOptions | number) => void,
    on: (event: string, handler: Function) => void
    once: (event: string, handler: Function) => void
    off: (event: string, handler: Function) => void
    emit: (event: string, ...params: any) => void
}

