import { Div } from '../../native/div'

export const Slide = () => {

    const self = Div()

    self.cssClass({
        position: 'absolute',
        overflowX: 'hidden',
        width: '100%',
        height: '100%'
    })

    return {
        ...self,
        requestNext(v: any) { console.log('slide.ts', v) },
        requestPrev() { },
        requestReset() { console.log('in req next') },
        onEnter() { },
        reset() { /* console.log('in reset slide', self); self.emit('reset') */ } 
    }
}