export function OS() {
    var userAgent = navigator.userAgent || navigator.vendor
    if (/android/i.test(userAgent)) {
        return 'Android'
    }
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return 'iOS'
    }
    return 'others'
}