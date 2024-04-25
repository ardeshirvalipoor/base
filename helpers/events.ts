import { isTouchDevice } from "./device";

export type EVENTS =
    | 'click'
    | 'mouseover'
    | 'mouseenter'
    | 'mouseout'
    | 'mousedown'
    | 'mouseup'
    | 'mouseleave'
    | 'escape'
    | 'input'
    | 'blur'
    | 'hover'
    | 'focus'
    | 'change'
    | 'submit'
    | 'cancel'
    | 'delete'
    | 'appended'
    | 'resize'
    | 'mounted'
    | 'scroll'
    | 'scrollend'
    | 'removed'
    | 'tap'
    | 'touchstart'
    | 'touchend'
    | 'touchcancel'
    | 'touchmove'
    | 'node-added'
    | 'child-appended'
    | 'paste'
    | 'theme-changed'

export function disableTouchStartPassive() {
    document.addEventListener('touchstart', () => false, { passive: true });
}

export function disableContextMenu(options: { touch: boolean, mouse: boolean }) {
    if (options?.touch && isTouchDevice()) {
        document.addEventListener('contextmenu', (event) => event.preventDefault());
    }
    if (options?.mouse && !isTouchDevice()) {
        document.addEventListener('contextmenu', (event) => event.preventDefault());
    }
}
