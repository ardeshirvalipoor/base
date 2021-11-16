import { Base } from '../base'

export const Input = (placeholder = '', type = 'text', options: any = { }) => {

    const base = type == 'textarea' ? Base<HTMLInputElement>('textarea') : Base<HTMLInputElement>('input')
    base.el.setAttribute('type', type)
    base.el.setAttribute('placeholder', placeholder)
    if (options['accept']) base.el.setAttribute('accept', options['accept']) // For now

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