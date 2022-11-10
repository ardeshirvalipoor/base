import { IAppender } from '../utils/appender'
import { IEmitter } from '../utils/emitter'
import { IStyler } from './style'

export interface IBaseComponent<K extends keyof HTMLElementTagNameMap> extends IEmitter, IAppender, IStyler {
    el: HTMLElementTagNameMap[K]
    id: string
}

export interface IBaseSVGComponent<K extends keyof SVGElementTagNameMap> extends IBaseComponent<any> {
    el: SVGElementTagNameMap[K]
}