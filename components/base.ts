import { nextId } from '../utils/id-generator'
import { emitter, IEmitter } from '../utils/emitter'
import _emitter from '../utils/emitter'

import appender, { IAppender } from '../utils/appender'
import styler, { IStyler } from '../utils/styler'

export function Base<K extends keyof HTMLElementTagNameMap = 'div'>(name: K): IBaseComponent<K> {
    const id = 'base-' + nextId()
    const el = document.createElement(name); el.setAttribute('id', id)
    const base = <IBaseComponent<K>>{ id, el }
    _emitter.on('theme-changed', (theme: string) => base.el.classList.toggle(theme))
    return Object.assign(base, emitter(), appender(base), styler(base))
}

export function BaseSVG<K extends keyof SVGElementTagNameMap = 'svg'>(name: K): IBaseSVGComponent<K> {
    const id = 'base-' + nextId()
    const el = document.createElementNS('http://www.w3.org/2000/svg', name); el.setAttribute('id', id)
    const base = <IBaseSVGComponent<K>>{ id, el }

    return Object.assign(base, emitter(), appender(base), styler(base))
}

export interface IBaseComponent<K extends keyof HTMLElementTagNameMap> extends IEmitter, IAppender, IStyler {
    el: HTMLElementTagNameMap[K]
    id: string
}

export interface IBaseSVGComponent<K extends keyof SVGElementTagNameMap> extends IBaseComponent<any> {
    el: SVGElementTagNameMap[K]
}