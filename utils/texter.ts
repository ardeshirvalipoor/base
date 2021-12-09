import { IBaseComponent } from '../components/base'

export function texter(base: IBaseComponent<any>) {
    return {
        text(content = '') {
            base.el.textContent = content
        },
        html(content = '') {
            base.el.innerHTML = content
        }
    }
}