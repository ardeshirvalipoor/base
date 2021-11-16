import { ISelf } from '../components/base'

export function texter<T extends HTMLElement>(base: ISelf<T>){
    return {
        text(content = '') {
            base.el.textContent = content
        },
        html(content = '') {
            base.el.innerHTML = content
        }
    }
}