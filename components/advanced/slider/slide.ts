import { Div } from '../../native/div'

export const Slide = () => {

    const base = Div()

    base.cssClass({
        position: 'absolute',
        overflowX: 'hidden',
        width: '100%',
        height: '100%'
    })


    return Object.assign(
        base,
        {
            requestNext(v: any) { console.log('slide.ts', v) },
            requestPrev() { },
            requestReset() { console.log('in req next') },
            onEnter() { },
            reset() { /* console.log('in reset slide', base); base.emit('reset') */ }
        }
    )
}