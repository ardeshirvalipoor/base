import { Base } from '../base'

export const Button = (text: string, options = {}) => {

    const base = Base<HTMLButtonElement>('button')
    base.el.innerHTML = text


    return Object.assign(
        base,
        {
            focus() {
                base.el.focus()
            },
            blur() {
                base.el.blur()
            }
        }
    )
}