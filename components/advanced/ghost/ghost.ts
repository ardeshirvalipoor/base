import { Self } from '../../self'

export const Ghost = (options: IGhostOptions = {}) => {

    const self = Self()

    const opts = { opacity: .15, bg: '#000', size: 48, ...options }
    self.cssClass({
        width: opts.size + 'px', // Todo: handle %
        height: opts.size + 'px', // Todo: handle %
        opacity: '0',
        pointerEvents: 'none',
        borderRadius: '50%',
        backgroundColor: opts.bg,
        position: 'absolute',
        willChange: 'transform,opacity'
    })
    let touchStartTime = 0
    let X = 0
    let Y = 0
    self.mounted = () => {
        const { left, top } = self.el.getBoundingClientRect()
        X = left
        Y = top
    }
    return {
        ...self,
        activate(e: TouchEvent) {
            touchStartTime = new Date().valueOf()
            const { pageX, pageY } = e.touches[0]
            self.style({
                transition: 'all 0s',
                left: pageX - opts.size / 2 + 'px',
                top: pageY - opts.size / 2 + 'px',
                transform: `scale(0)`
            })
            self.style({
                transition: 'all .16s',
                transform: `scale(2)`,
                opacity: opts.opacity + ''
            }, { delay: 5 })
        },
        deactivate() {
            self.style({
                transition: 'all .44s',
                opacity: '0'
            }, { delay: 300 - new Date().valueOf() + touchStartTime })
        }
    }
}


interface IGhostOptions {
    size?: number,
    opacity?: number,
    bg?: string
}

