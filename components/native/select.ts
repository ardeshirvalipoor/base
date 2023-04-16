import { Base } from '../base'
import { Option } from './option'

export const Select = (options: { value: string, text: string }[] = []) => {
    
    const base = Base('select')
    options.forEach(({ value, text }) => {
        const option = Option(value, text)
        base.append(option)
    })

    return Object.assign(base, {
        add: (value: any, text: string) => {
            base.append(Option(value, text))
        }
    })

}