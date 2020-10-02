import { IBase } from '../components/self'

export function TM() {
    let x: number | string = 0, y = 0
    return function T(options = <ITransformOptions>{}) {
        x = _V(options.x)
        y = typeof options.y == 'number' ? options.y : y
        return `X: ${x} Y: ${y}`
    }
    function _V(v: number | string) {
        return typeof v == 'number' ? `${v}px` : v
    }
}


interface ITransformOptions {
    x: number | string
    y: number | string
    z: number | string
    rx: number | string
    ry: number | string
    rz: number | string
    r: number | string
    sx: number | string
    sy: number | string
    s: number | string
}
var styleEl = document.createElement('style')
styleEl.type = 'text/css'
document.getElementsByTagName('head')[0].appendChild(styleEl)

export function styler(base: IBase<HTMLElement>) {
    return {
        style(style: CS, options: IStyleOptions | number): void {
            const delay = typeof options == 'number' ? options : options?.delay
            // console.log({style});
            if (delay) {
                setTimeout(applyStyle, delay)
            } else {
                applyStyle()
            }
            function applyStyle() {
                Object.keys(style).map((s: any) => {
                    base.el.style[s] = typeof style[s] == 'function' ? style[s]() : style[s]
                })
            }

        },
        cssClass(style: CS, options: IStyleOptions = {}): void {
            if (options.delay) {
                setTimeout(() => applyCssClass(style), options.delay)
            } else {
                applyCssClass(style)
            }
            function applyCssClass(style: CS) {
                let styleString = ''
                var name = 'style-' + base.id
                Object.keys(style).map((s: any) => {
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
                styleEl.innerHTML += `.${name}{${styleString}}`
                base.el.setAttribute('class', name)
                function generateStyle(obj: any) {
                    return Object.keys(obj).reduce((body, o) => body + getBody(o, obj), '')
                }
                function getBody(o: string, obj: any) {
                    let snake = o.replace(/[A-Z]/g, (w: string) => `-${w.toLowerCase()}`)
                    let value = typeof obj[o] == 'function' ? obj[o]() : obj[o]
                    return snake + ':' + value + ';'
                }
            }
        }
    }
}

export interface IStyleOptions {
    delay?: number
}

type Style = {
    [P in keyof CSSStyleDeclaration]?: any
}
export type CS = Style & { [index: string]: Style }