import { IBaseComponent, IBaseSVGComponent } from '../interfaces/base'
import { CS, IStyleOptions } from '../interfaces/style'
import ldb from '../lib/ldb'
import emitter from './emitter'
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
        
        if (!style['&.dark']) return base
        const THEME = ldb.get('BASE_APP_THEME')
        if (THEME === 'dark') base.el.classList.add('dark')
        emitter.once('theme-changed', (theme: string) => {
            setTimeout(() => {
                if (theme === 'dark') {
                    base.el.classList.add('dark')
                } else {
                    base.el.classList.remove('dark')
                }
            }, 0);
        })

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
            let name = 'style-' + base.id + '-' + Math.floor(Math.random() * 100000)
            if (typeof options === 'object' && options.name) name = options.name
            Object.keys(style).sort((a, b) => {
                if (a.match(/\&.*|\@/) && !b.match(/\&.*|\@/)) return 1
                if (!a.match(/\&.*|\@/) && b.match(/\&.*|\@/)) return -1
                return 0
            }).forEach((prop: any) => {
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
            if (snake.startsWith('webkit')) snake = '-' + snake
            let value = typeof obj[prop] == 'function' ? obj[prop]() : obj[prop]
            return (value?.toString() || 'unset').split(';').map((v: string) => `${snake}:${v};`).join('')
        }
    }
})
