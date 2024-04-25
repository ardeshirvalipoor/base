import { CS } from '../utils/styler'

export const ABSOLUTE = <CS>{
    position: 'absolute',
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
}

export const NONE = <CS>{
    display: 'none'
}

export const BLOCK = <CS>{
    display: 'block'
}

export const HIDE = <CS>{
    opacity: '0',
    pointerEvents: 'none'
}

export const SHOW = <CS>{
    opacity: '1',
    pointerEvents: 'inherit'
}

export const CENTER: CS = <CS>{
    display: 'flex', // Todo: ; not working here
    alignItems: 'center',
    justifyContent: 'center'
}

export const ROUND = <CS>{
    borderRadius: '50%'
}

export const SCROLLY = <CS>{
    // overflowX: 'hidden',
    overflowY: 'scroll',
    webkitOverflowScrolling: 'touch'
}

export const Y = (y: number | string) => <CS>({
    transform: `translateY(${y}${typeof y === 'number' ? 'px' : ''})`,
})

export const X = (x: number | string) => <CS>({
    transform: `translateX(${x}${typeof x === 'number' ? 'px' : ''})`,
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

export const WH = (wh: number | string, h?: number | string): CS => {
    if (typeof wh == 'number') wh = wh.toString() + 'px'
    if (typeof h == 'number') h = h.toString() + 'px'
    return {
        width: wh,
        height: h || wh
    }
    // transition: `${props} ${time}s ${type}`,
}

