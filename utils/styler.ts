import { IBaseComponent, IBaseSVGComponent } from "../components/base"
const STYLE_EL = document.getElementsByTagName('style')[0]

export default (base: IBaseComponent<any> | IBaseSVGComponent<any>) => ({
    style(style: CS, options: IStyleOptions | number): void {
        const delay = typeof options === 'number' ? options : options?.delay
        typeof delay === 'number' ? setTimeout(applyStyle, delay) : applyStyle()

        function applyStyle() {
            Object.keys(style).forEach((s: any) => {
                base.el.style[s] = typeof style[s] == 'function' ? style[s]() : style[s]
            })
        }
    },
    cssClass(style: CS, options: IStyleOptions | number): void {
        // TODO: check multiple classes
        const delay = typeof options === 'number' ? options : options?.delay
        typeof delay === 'number' ? setTimeout(applyCssClass, delay) : applyCssClass()

        function applyCssClass() {
            let styleString = ''
            var name = 'style-' + base.id
            Object.keys(style).forEach((s: any) => {
                if (s.includes('&')) {
                    const key = s.slice(1)
                    let body = generateStyle(style[s])
                    styleString += '}.' + name + key + '{' + body
                } else if (s.includes('@')) {
                    let body = generateStyle(style[s])
                    styleString += '}' + s + '{.' + name + '{' + body + '}'
                } else {
                    styleString += getBody(s, style)
                }
            })
            STYLE_EL.innerHTML += `.${name}{${styleString}}`
            base.el.setAttribute('class', name)
        }
        function generateStyle(obj: any) {
            return Object.keys(obj).reduce((body, o) => body + getBody(o, obj), '')
        }
        function getBody(o: string, obj: any) {
            let snake = o.replace(/[A-Z]/g, (w: string) => `-${w.toLowerCase()}`)
            let value = typeof obj[o] == 'function' ? obj[o]() : obj[o]
            return snake + ':' + value + ';'
        }
    }
})

export type Style = {
    [P in keyof CSSStyleDeclaration]?: any
}

export type CS = Style & { [index: string]: Style }

export interface IStyleOptions {
    delay?: number
}
export interface IStyler {
    cssClass: (style: CS, options?: IStyleOptions | number) => void
    style: (style: CS, options?: IStyleOptions | number) => void,
}