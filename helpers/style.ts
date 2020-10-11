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

export const Y = (y: number) => <CS>({
    transform: `translateY(${y}px)`,
})

export const X = (x: number) => <CS>({
    transform: `translateX(${x}px)`,
})