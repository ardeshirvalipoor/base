
<!-- 1 -->
# Base
A component based vanillajs library

## How to use
To create a component just use:

	// Component child.js
    const self = Self()
    // or
    consr seld = Div('Hi')

It will create a div element.
Styling is easy:

    self.cssClass({
		color: 'red',
		height: '20px'
	})

Once we exported this component, we can import that inside another component:

    // Component parent.js
    const self = Self()
    const child = Child()
    self.append(child)
    // will be rendered as <parent><child/><parent/>
