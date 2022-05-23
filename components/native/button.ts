import { Base } from '../base'

export const Button = (text: string = '', options = {}) => {

    const base = Base('button')
    
    base.el.innerHTML = text
    base.cssClass({
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '5px'
    })

    const out = Object.assign(
        base,
        {
            focus() {
                base.el.focus()
            },
            blur() {
                base.el.blur()
            },
            disable() {
                base.el.setAttribute('disabled', 'true')
                return out
            },
            enable() {
                base.el.removeAttribute('disabled')
                return out
            }
        }
    )

    return out
}