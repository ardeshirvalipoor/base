import { Base } from '../base'

export const Button = (text: string = '', options = {}) => {

    const base = Base('button')
    
    base.el.innerHTML = text
    base.cssClass({
        cursor: 'pointer',
        padding: '10px',
        borderRadius: '5px'
    })

    base.el.onclick = () => {
        base.emit('click')
    }

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
            },
            text(text: string = 'Button') {
                base.el.innerHTML = text
                return out
            }
        }
    )

    return out
}