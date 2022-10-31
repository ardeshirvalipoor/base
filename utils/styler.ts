import { IBaseComponent, IBaseSVGComponent } from "../components/base"
let STYLE_DB: any = {}
const STYLE_EL = document.createElement('style')
document.head.appendChild(STYLE_EL)

export default (base: IBaseComponent<any> | IBaseSVGComponent<any>) => ({
    style(style: CS, options: IStyleOptions | number) {
        const delay = typeof options === 'number' ? options : options?.delay
        typeof delay === 'number' ? setTimeout(applyStyle, delay) : applyStyle()
        return base
        function applyStyle() {
            Object.keys(style).forEach((s: any) => {
                base.el.style[s] = typeof style[s] == 'function' ? style[s]() : style[s]
            })
        }
    },
    cssClass(style: CS, options: IStyleOptions | number) {
        // Todo: urgent fix
        // TODO: check multiple classes
        const delay = typeof options === 'number' ? options : options?.delay
        typeof delay === 'number' ? setTimeout(applyCssClass, delay) : applyCssClass()
        return base
        function applyCssClass() {
            var { name, styleString } = generateStyleString()
            const nameReg = new RegExp(name, 'g')
            const key = styleString.replace(nameReg, '')
            if (STYLE_DB[key]) {
                base.el.classList.add(STYLE_DB[key])
                return
            }
            STYLE_DB[key] = name
            STYLE_EL.innerHTML += `.${name}{${styleString}}`
            base.el.classList.add(name)
        }

        function generateStyleString() {
            let styleString = ''
            var name = 'style-' + base.id + '-' + Math.floor(Math.random() * 100000)
            Object.keys(style).sort((a,b)=>{
                if (a.match(/\&.*|\@/) && !b.match(/\&.*|\@/)) return 1
                if (!a.match(/\&.*|\@/) && b.match(/\&.*|\@/)) return -1
                return 0
Í            }).forEach((prop: any) => {
                if (prop.includes('&')) {
                    const key = prop.slice(1)
                    let body = generateStyle(style[prop])
                    styleString += '}.' + name + key + '{' + body
                } else if (prop.includes('@')) {
                    let body = generateStyle(style[prop])
                    styleString += '}' + prop + '{.' + name + '{' + body + '}'
                } else {
                    styleString += getPropValueLine(prop, style)
                }
            })
            return { name, styleString }
        }

        function generateStyle(obj: any) {
            return Object.keys(obj).reduce((body, o) => body + getPropValueLine(o, obj), '')
        }

        function getPropValueLine(prop: string, obj: any) {
            let snake = prop.replace(/[A-Z]/g, (w: string) => `-${w.toLowerCase()}`)
            let value = typeof obj[prop] == 'function' ? obj[prop]() : obj[prop]
            return (value?.toString() || 'unset').split(';').map((v: string) => `${snake}:${v};`).join('')
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
    cssClass: (style: CS, options?: IStyleOptions | number) => IBaseComponent<any> | IBaseSVGComponent<any>
    style: (style: CS, options?: IStyleOptions | number) => IBaseComponent<any> | IBaseSVGComponent<any>,
}