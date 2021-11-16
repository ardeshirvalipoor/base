import { styler, CS, IStyleOptions } from '../utils/styler'
import { destroyer } from '../utils/destroyer'
import { appender } from '../utils/appender'
import { nextId } from '../utils/id-generator'
import emitter from '../utils/emitter'
import { elements } from '../utils/elements-db'

var styleEl = document.createElement('style')
styleEl.type = 'text/css'
document.getElementsByTagName('head')[0].appendChild(styleEl)

export function Base<T extends HTMLElement = HTMLDivElement, U = ISelf<T, any>>(type: string = 'div')/* : ISelf<T, U> */ {
    const id = 'base-' + nextId()
    let data:any = undefined
    const base: IBase<T, U> = {
        id,
        el: type == 'svg' ? document.createElementNS('http://www.w3.org/2000/svg', 'svg') : <T>document.createElement(type),
        children: [],
        parent: null,
        mounted() { },
        append(...args: ISelf<T>[]) {
            for (const component of args) {
                const c = /* await */ component
                elements[c.id] = c //els db
                base.el.appendChild(c.el)
                base.children.push(c)
                c.parent = base // should pass a base
            }
        },
        prepend(...args: ISelf<T>[]) {
            args.map(async component => {
                const c = /* await */ component
                elements[c.id] = c
                base.el.insertBefore(c.el, base.el.childNodes[0])
                base.children.unshift(c)
                c.parent = base // should pass a base
            })
        },
        destroy() {
            // No base destroyer?
            base.children.map(child => child.destroy())
            base.listeners = []
            base.el.remove()
            // component.parent.children = component.parent.children.filter((child: any) => child != component)
        },
        setData(_data: any) {
            data = _data
        },
        getData() {
            return data
        },
        empty() {
            base.children.map(child => child.destroy())
            base.children = []
        },
        style(style: CS, options: IStyleOptions | number): void {
            const delay = typeof options == 'number' ? options : options?.delay
            // console.log({style});
            if (delay !== null && delay !== undefined) {
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
            return base.style(style, options)
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

    base.el.setAttribute('id', id)
    
    return Object.assign(
        base,
        // appender(base),
        // destroyer(base),
        // styler(base),
        emitter()
    )
    
    // return {
    //     ...base,
    //     ...appender(base),
    //     ...destroyer(base),
    //     ...styler(base),
    //     ...emitter(base)
    // }
}

export interface IBase<T, U = any> {
    el: T /* | SVGElement */,
    children: U[]
    parent?: ISelf<T, U> | null
    id: string
    mounted: () => void
    // IDestroyer
    append: Function // a => component
    prepend: Function
    empty: () => void,
    setData: (data :any) => void,
    getData: () => any,
    destroy: () => void,
    cssClass: (style: CS) => void
    style: (style: CS, options?: IStyleOptions | number) => void,
}
export interface ISelf<T, U = any> extends IBase<T, U> {
    on: (event: string, handler: Function) => void
    once: (event: string, handler: Function) => void
    off: (event: string, handler: Function) => void
    emit: (event: string, ...params: any) => void
}

