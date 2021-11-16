import { Base } from '../base'

export const SVG = (content: string = '', boxWidth: number, boxHeight: number) => {

    const base = Base<HTMLElement>('svg')
    base.el.innerHTML = content
    base.el.setAttributeNS(null, 'viewBox', '0 0 ' + boxWidth + ' ' + boxHeight)
    base.el.setAttributeNS(null, 'width', boxWidth)
    base.el.setAttributeNS(null, 'height', boxHeight)

    return base
}