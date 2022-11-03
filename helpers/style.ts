import { CS } from '../utils/styler'

export const ABSOLUTE = <CS>{
    position: 'absolute',
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
}

export const HIDE = <CS>{
    opacity: '0',
    pointerEvents: 'none'
}

export const SHOW = <CS>{
    opacity: '1',
    pointerEvents: 'inherit'
}

export const CENTER = <CS>{
    display: 'flex', // Todo: ; not working here
    alignItems: 'center',
    justifyContent: 'center'
}

export const ROUND = <CS>{
    borderRadius: '50%'
}

export const SCROLLY = <CS> {
    // overflowX: 'hidden',
    overflowY: 'scroll',
    webkitOverflowScrolling: 'touch'
}

export const Y = (y: number) => <CS>({
    transform: `translateY(${y}px)`,
})

export const X = (x: number) => <CS>({
    transform: `translateX(${x}px)`,
})

export const S = (s: number) => <CS>({
    transform: `scale(${s})`,
})

export const SX = (s: number) => <CS>({
    transform: `scaleX(${s})`,
})
export const SY = (s: number) => <CS>({
    transform: `scaleY(${s})`,
})

export const R = (r: number) => <CS>({
    transform: `rotate(${r}deg)`,
})

export const EASE = (time: number, props = 'all', type = '') => <CS>({
    transition: `${props} ${time}s ${type}`,
})

export const WH = (d1: number | string, d2?: number | string): CS => {
    if (typeof d1 == 'number') d1 = d1.toString() + 'px'
    if (typeof d2 == 'number') d2 = d2.toString() + 'px'
    return {
        width: d1,
        height: d2 || d1
    }
    // transition: `${props} ${time}s ${type}`,
}

