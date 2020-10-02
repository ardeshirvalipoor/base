import { Self } from '../self'

export const Img = (path: string = '', options: IImage = {}) => {


    const self = Self<HTMLImageElement>('img')
    const opts = {width: 'auto', ...options}

    self.style({
        width: opts.width + 'px'
    })
    self.el.src = path

    return {
        ...self,
    }
}

interface IImage {
    width?: number
}