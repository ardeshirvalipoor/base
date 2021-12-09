import { Base } from '../base'

export const Img = (path: string = '', options: IImage = {}) => {

    const base = Base('img')
    const opts = { width: 'auto', height: 'auto', ...options }

    base.style({
        width: opts.width + 'px',
        height: opts.height + 'px'
    })
    base.el.src = path

    return base
}

export interface IImage {
    width?: number
    height?: number
}