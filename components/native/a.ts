import { texter } from '../../utils/texter'
import { Base } from '../base'

export const A = (href?: string, title?: string, target = '_self') => {

    const base = Base('a')
    base.el.href = href || '#'
    base.el.setAttribute('target', target)
    base.el.textContent = title || ''

    return Object.assign(base, {
        setValue: (value: string) => {
            base.el.textContent = value
            if (value.startsWith('http')) base.el.href = value
        },
        setHref: (href: string) => base.el.href = href,
        setTarget: (target: string) => base.el.setAttribute('target', target),
        setDownload: (filename: string) => base.el.setAttribute('download', filename),
        getHref: () => base.el.href,
    })

}