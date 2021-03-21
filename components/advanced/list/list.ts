import { Self } from '../../self'

export function List<U>() {
    const self = Self<HTMLUListElement, U>()
    let height = 0
    self.on('mounted', () => {
        height = self.el.getBoundingClientRect().height
    })

    self.el.addEventListener('scroll', () => {
        self.emit('scroll', self.el.scrollTop)
        if (self.el.scrollHeight <= self.el.scrollTop + height) {
            self.emit('scrolled-to-end')
        }
    })

    return self
}