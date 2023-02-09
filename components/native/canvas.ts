import { Base } from '../base'

export const Canvas = (W: number, H: number) => {

    const base = Base('canvas')
    base.el.width = W
    base.el.height = H

    return Object.assign(base, {
        context: <CanvasRenderingContext2D>base.el.getContext('2d', { willReadFrequently: true })
    })
}