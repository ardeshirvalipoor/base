import { Base, BaseSVG } from '../base'

export const SVG = (content: string = '', viewBox: string | number, viewBox2?: number) => {
    let boxWidth = 0
    let boxHeight = 0
    if (typeof viewBox === 'string') {
        const viewBoxArr = viewBox.split(' ')
        boxWidth = parseInt(viewBoxArr[2])
        boxHeight = parseInt(viewBoxArr[3])
    } else {
        boxWidth = viewBox
        boxHeight = viewBox2 || viewBox
        viewBox = `0 0 ${viewBox} ${viewBox}`
    }
    const base = BaseSVG('svg')
    base.el.innerHTML = content
    base.el.setAttributeNS(null, 'viewBox', viewBox)
    base.el.setAttributeNS(null, 'width', boxWidth.toString())
    base.el.setAttributeNS(null, 'height', boxHeight.toString())

    return base
}