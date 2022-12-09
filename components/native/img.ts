import { Base } from '../base'

export const Img = (path: string = '', options: IImage = {}) => {

    const base = Base('img')
    const opts = { width: 'auto', ...options }
    if (options.alt) base.el.setAttribute('alt', options.alt)
    base.style({
        width: opts.width + 'px',
        height: opts.height? (opts.height + 'px') : 'auto'
    })
    base.el.src = path || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mPs6OuoBwAFYwIfBAd8EQAAAABJRU5ErkJggg=='

    return base
}

export interface IImage {
    width?: number
    height?: number
    alt?: string
}