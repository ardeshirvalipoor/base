import { nextId } from '../utils/id-generator'
import appender from '../utils/appender'
import styler  from '../utils/styler'
import emitter, { _emitter } from '../utils/emitter'
import ldb from '../lib/ldb'
import { IBaseComponent, IBaseSVGComponent } from '../interfaces/base'

const THEME = ldb.get('BASE_APP_THEME')

export function Base<K extends keyof HTMLElementTagNameMap>(name = <K>'div'): IBaseComponent<K> {

    const id = nextId()
    const el = document.createElement(<K>name); el.setAttribute('data-base-id', id)
    const base = <IBaseComponent<K>>{ id, el }
    if (THEME) base.el.classList.toggle(THEME)
    emitter.on('theme-changed', (theme: string) => base.el.classList.toggle(theme))
    return Object.assign(base, _emitter(), appender(base), styler(base))
}

export function BaseSVG<K extends keyof SVGElementTagNameMap = 'svg'>(name: K): IBaseSVGComponent<K> {
    const id = nextId()
    const el = document.createElementNS('http://www.w3.org/2000/svg', name); el.setAttribute('data-base-id', id)
    const base = <IBaseSVGComponent<K>>{ id, el }

    return Object.assign(base, _emitter(), appender(base), styler(base))
}

