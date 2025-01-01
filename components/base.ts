import { nextId } from '../utils/id-generator'
import appender, { IAppender } from '../utils/appender'
import styler, { IStyler } from '../utils/styler'
import { BaseEventMap, IEmitter, createEmitter } from '../utils/emitter'
import mounter from '../utils/mounter'


export function Base<K extends keyof HTMLElementTagNameMap>(name = <K>'div'): IBaseComponent<K> {
    const id = nextId()
    const el = document.createElement(<K>name) // Todo: consider createDocumentFragment
    el.setAttribute('data-base-id', id)
    const base = <IBaseComponent<K>>{ id, el }
    mounter.observe()

    return Object.assign(base, createEmitter<BaseEventMap>(), appender(base), styler(base))
}

export function BaseSVG<K extends keyof SVGElementTagNameMap = 'svg'>(name: K): IBaseSVGComponent<K> {
    const id = nextId()
    const el = document.createElementNS('http://www.w3.org/2000/svg', name); el.setAttribute('data-base-id', id)
    const base = <IBaseSVGComponent<K>>{ id, el }

    return Object.assign(base, createEmitter(), appender(base), styler(base))
}


export interface IBaseComponent<K extends keyof HTMLElementTagNameMap> extends IEmitter<BaseEventMap>, IAppender, IStyler {
    el: HTMLElementTagNameMap[K]
    id: string
    parent: IBaseComponent<any>
    isMounted?: boolean,
}

export interface IBaseSVGComponent<K extends keyof SVGElementTagNameMap> extends IBaseComponent<any> {
    el: SVGElementTagNameMap[K]
}