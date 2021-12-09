import { Base, BaseSVG } from '../base'

export const SVG = (content: string = '', boxWidth: number, boxHeight: number) => {

    const base = BaseSVG('svg')
    base.el.innerHTML = content
    base.el.setAttributeNS(null, 'viewBox', '0 0 ' + boxWidth + ' ' + boxHeight)
    base.el.setAttributeNS(null, 'width', boxWidth.toString())
    base.el.setAttributeNS(null, 'height', boxHeight.toString())

    return base
}