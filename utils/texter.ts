import { IBaseComponent } from "../components/base"

export function texter(base: IBaseComponent<any>) {
    return {
        // Todo: use text node, not innerHTML... ghostify not working with it
        text(content = '') {
            base.el.textContent = content
        },
        html(content = '') {
            base.el.innerHTML = content
        }
    }
}