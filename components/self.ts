import { styler, CS, IStyleOptions } from '../utils/styler'
import { destroyer } from '../utils/destroyer'
import { appender } from '../utils/appender'
import { nextId } from '../utils/id-generator'
import { emitter } from '../utils/emitter'

export function Self<T extends HTMLElement = HTMLDivElement>(type: string = 'div'): ISelf<T> {
    const id = 'core-' + nextId()
    const base: IBase<T> = {
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

export interface IBase<T> {
    el: T,
    listeners: any[]
    children: ISelf<T>[]
    parent?: ISelf<T> | null
    id: string
    mounted: () => void
}
export interface ISelf<T> extends IBase<T> {
    append: Function // a => component
    prepend: Function
    destroy: () => void,
    empty: () => void,
    cssClass: (style: CS) => void
    style: (style: CS, options?: IStyleOptions | number) => void,
    on: (event: string, handler: Function) => void
    off: (event: string, handler: Function) => void
    emit: (event: string, ...params: any) => void
}

