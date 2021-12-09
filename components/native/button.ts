import { Base } from '../base'

export const Button = (text: string, options = {}) => {

    const base = Base('button')
    
    base.el.innerHTML = text
    base.cssClass({
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '5px'
    })

    return Object.assign(
        base,
        {
            focus() {
                base.el.focus()
            },
            blur() {
                base.el.blur()
            },
            disable() {
                base.el.disabled = true
            },
            enable() {
                base.el.disabled = false
            }
        }
    )
}