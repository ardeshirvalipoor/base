import { isTouchDevice } from "../helpers/device";

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
