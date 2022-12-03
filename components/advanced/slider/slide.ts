import { Div } from '../../native/div'

export const Slide = () => {

    const base = Div()

    base.cssClass({
        position: 'absolute',
        overflowX: 'hidden',
        width: '100%',
        height: '100%'
    })


    return base
}