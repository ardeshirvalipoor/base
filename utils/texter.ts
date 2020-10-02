import { ISelf } from '../components/self'

export function texter<T extends HTMLElement>(base: ISelf<T>){
    return {
        text(content: string) {
            base.el.textContent = content
        },
        html(content: string) {
            base.el.innerHTML = content
        }
    }
}