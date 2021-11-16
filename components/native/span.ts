import { Base, ISelf } from '../base'

export const Span = (content: string = '') => {

    const base = Base<HTMLSpanElement>('span')
    base.el.textContent = content

    return Object.assign(
        base,
        {
            text(content: string) {
                base.el.textContent = content
            }
        }
    )
}
