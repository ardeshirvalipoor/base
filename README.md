
<!-- 1 -->
# Base
A component based vanillajs library

## How to use
To create a component just use:

	// Component child.js
    const base = Base()
    // or
    consr base = Div('Hi')

It will create a div element.
Styling is easy:

    base.cssClass({
		color: 'red',
		height: '20px'
	})

Once we exported this component, we can import that inside another component:

    // Component parent.js
    const base = Base()
    const child = Child()
    base.append(child)
    // will be rendered as <parent><child/><parent/>
