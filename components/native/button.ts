import { Base } from '../base'

export const Button = () => {

    const base = Base('button')

    base.cssClass({
        cursor: 'pointer',
    })

    base.el.onclick = () => setTimeout(() => base.emit('click'), 100)

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
                base.el.setAttribute('disabled', 'true')
            },
            enable() {
                base.el.removeAttribute('disabled')
            },
            text(text: string = 'Button') {
                base.el.innerHTML = text
            }
        }
    )
}