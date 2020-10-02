import { Self } from '../self'

export const SVG = (content: string = '', boxWidth: number, boxHeight: number) => {

    const self = Self<HTMLElement>('svg')
    self.el.innerHTML = content
    self.el.setAttributeNS(null, 'viewBox', '0 0 ' + boxWidth + ' ' + boxHeight)
    self.el.setAttributeNS(null, 'width', boxWidth)
    self.el.setAttributeNS(null, 'height', boxHeight)
    return {
        ...self
    }
}