import { Div } from '../../native/div'

export const Slide = () => {

    const self = Div()

    self.cssClass({
        position: 'absolute',
        width: '100%',
        height: '100%'
    })

    return {
        ...self,
        requestNext() { },
        requestPrev() { },
        requestReset() { },
        onEnter() { }
    }
}