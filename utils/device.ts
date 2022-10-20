const userAgent = window.navigator?.userAgent?.toLowerCase() || window.navigator?.vendor?.toLowerCase()

export const isIOS = /iphone|ipad|ipod/.test(userAgent) && !('MSStream' in window)
export const isAndroid = /android/i.test(userAgent)
export const otherOS = !isIOS && !isAndroid
export const isInStandaloneMode = () => 'standalone' in window.navigator

export const H = Math.max(window.innerHeight, window.outerHeight) + (isIOS ? 20 : 0)
export const NUM_BOUNCINGS = Math.floor(H / 80)
export const ST = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sat")) || 0
export const SB = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sab")) || 0
export function SAFE_MARGIN() {
    var result, computed, div = document.createElement('div')

    div.style.padding = 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
    document.body.appendChild(div)
    computed = getComputedStyle(div)
    result = {
        top: parseInt(computed.paddingTop) || 0,
        right: parseInt(computed.paddingRight) || 0,
        bottom: parseInt(computed.paddingBottom) || 0,
        left: parseInt(computed.paddingLeft) || 0
    }
    document.body.removeChild(div)

    return result
}

// return { top: 0, right: 44, bottom: 21, left: 44 }