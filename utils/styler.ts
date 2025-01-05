function sanitizeStyleValue(value: any): any {
    // Placeholder for style value sanitization
    return value
}
export type Style = {
    [P in keyof CSSStyleDeclaration]?: any
}

export type CS = Style & { [index: string]: Style }

export interface IStyleOptions {
    delay?: number,
    name?: string,
}
export interface IStyler {
    cssClass: (style: CS, options?: IStyleOptions | number) => IBaseComponent<any> | IBaseSVGComponent<any> // Todo: fix CS|any
    style: (style: CS, options?: IStyleOptions | number) => IBaseComponent<any> | IBaseSVGComponent<any>,
}

import { IBaseComponent, IBaseSVGComponent } from '../components/base'
import ldb from '../lib/ldb'
import { emitter } from './emitter'
import { nextId } from './id-generator'

const STYLE_DB: any = {}
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
        // if style has &:dark, replace with .dark // maybe optimize it
        style = Object.keys(style).reduce((acc, key) => {
            if (key === '&:dark') {
                acc['&.dark'] = style[key]
                return acc
            }
            acc[key] = style[key]
            return acc
        }, {} as CS)

        const delay = typeof options === 'number' ? options : options?.delay
        typeof delay === 'number' ? setTimeout(applyCssClass, delay) : applyCssClass()

        if (!style['&.dark']) return base
        const THEME = ldb.get('BASE_APP_THEME')
        if (THEME === 'dark') base.el.classList.add('dark')
        emitter.on('theme-changed', (theme: string) => {
            setTimeout(() => {
                if (theme === 'dark') {
                    base.el.classList.add('dark')
                } else {
                    base.el.classList.remove('dark')
                }
            }, 0)
        })

        return base

        function applyCssClass() {
            const styles = generateStyleString()
            styles.forEach(({ name, body }) => {

                if (STYLE_DB[body]) { // check if body is the same, todo: advanced check
                    base.el.classList.add(STYLE_DB[body])
                    return
                }
                const stylesheet = STYLE_EL.sheet as CSSStyleSheet
                const rule = `${name[0] === '@' ? '' : '.'}${name} { ${body} }`
                stylesheet.insertRule(rule, stylesheet.cssRules.length)

                if (name.includes(':active')) {
                    const _name = `${name.replace(':', '-')}`
                    const _rule = `${name[0] === '@' ? '' : '.'}${name.replace(':', '-')} { ${body} }`
                    stylesheet.insertRule(_rule, stylesheet.cssRules.length)
                    base.el.addEventListener('touchstart', () => {
                        base.el.classList.add(_name)
                    })
                    base.el.addEventListener('touchend', () => {
                        base.el.classList.remove(_name)
                    })
                    base.el.addEventListener('touchcancel', () => {
                        base.el.classList.remove(_name)
                    })
                }
                if (!name.includes('&') && !name.includes('@') && !name.includes(':')) {
                    // if (/\W/.test(name)) {
                    base.el.classList.add(name)
                    STYLE_DB[body] = name
                }
            })
        }

        function generateStyleString() {

            const name = makeStyleName()
            let styleKeys: string[] = []
            let otherKeys: string[] = []
            let mediaKeys: string[] = []

            Object.keys(style).forEach((key) => {
                if (/^\&/.test(key)) otherKeys.push(key)
                if (/^\@/.test(key)) mediaKeys.push(key)
                if (/^\w/.test(key)) styleKeys.push(key)
            })

            const normalStyle = styleKeys.reduce((styleString: any, prop: any) => { // 'color: red; font-size: 12px;'
                styleString += getPropValueLine(prop, style)
                return styleString
            }, '')

            const specialStyle = otherKeys.reduce((styles: any, prop: any) => { // '&:dark': { color: 'red' }
                const key = prop.slice(1)
                const body = generateStyle(style[prop])
                styles.push({ name: name + key, body })
                return styles
            }, [])

            const mediaStyle = mediaKeys.reduce((styles: any, prop: any) => { // '@media (max-width: 600px)': { color: 'red' }
                const body = generateStyle(style[prop])
                styles.push({ name: prop, body: `.${name} { ${body} }` })
                return styles
            }, [])

            return [
                { name, body: normalStyle },
                ...specialStyle,
                ...mediaStyle
            ]
        }

        function generateStyle(obj: any) {
            return Object.keys(obj).reduce((body, o) => body + getPropValueLine(o, obj), '')
        }

        function getPropValueLine(prop: string, obj: any): string {
            let snake = prop.replace(/[A-Z]/g, (w: string) => `-${w.toLowerCase()}`)
            if (snake.startsWith('webkit')) snake = '-' + snake
            let value = sanitizeStyleValue(typeof obj[prop] == 'function' ? obj[prop]() : obj[prop])
            return (value?.toString() || 'unset').split(';').map((v: string) => `${snake}:${v};`).join('')
        }

        function makeStyleName() {
            let name = 's-' + nextId()
            if (typeof options === 'object' && options.name) name = options.name
            return name
        }
    }
})

