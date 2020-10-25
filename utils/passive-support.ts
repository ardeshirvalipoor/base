let supportsPassive = false
try {
    var opts = Object.defineProperty({}, 'passive', {
        get: function () {
            supportsPassive = true
        }
    })
    const nil = () => {}
    window.addEventListener('error', nil, opts)
    window.removeEventListener('error', nil, opts)
} catch (e) {
    console.log({ e })
}

export const PASSIVE = supportsPassive ? { passive: true } : false
