export let supportsPassive = false
try {
    var opts = Object.defineProperty({}, 'passive', {
        get: function () {
            supportsPassive = true
        }
    })
    const nil = () => {}
    window.addEventListener('error',    nil, opts)
    window.removeEventListener('error', nil, opts)
} catch (e) {

}