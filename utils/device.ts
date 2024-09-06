const userAgent = window.navigator?.userAgent?.toLowerCase() || window.navigator?.vendor?.toLowerCase()

export const isIOS = /iphone|ipad|ipod/.test(userAgent) && !('MSStream' in window)
export const isAndroid = /android/i.test(userAgent)
export const otherOS = !isIOS && !isAndroid
export const isInStandaloneMode = () => 'standalone' in window.navigator

export const H = Math.max(window.innerHeight, window.outerHeight) + (isIOS ? 20 : 0)
export const NUM_BOUNCINGS = Math.floor(H / 80)

export function isRunningInBrowser() {
    return !window.matchMedia('(display-mode: standalone)').matches
        && !window.matchMedia('(display-mode: fullscreen)').matches
        && !window.matchMedia('(display-mode: minimal-ui)').matches
}