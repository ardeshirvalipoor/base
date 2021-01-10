const userAgent = navigator.userAgent || navigator.vendor

export const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream
export const isAndroid = /android/i.test(userAgent)
export const otherOS = !isIOS && !isAndroid

export const H = Math.max(window.innerHeight, window.outerHeight) + (isIOS ? 20 : 0)