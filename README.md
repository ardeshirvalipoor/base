
<!-- 1 -->
# Base
A component based vanillajs library

## How to use
You can create a component by using:
```javascript
// Component child.js
const base = Base('div')
// or
const base = Div('Hi')

return base
```
We can import and use this component inside another component once we export it:
```javascript
// Component parent.js
import { Child } from './child'

const base = Base('div')
const child = Child()
base.append(child)

return base
// will be rendered as <div><div>Hi</div><div/>
```

Examples of differences from a standard HTML/JS code:
```html
<div>
    <p>Hello</p>
    <span>Test</span>
</div>
```
In HTML, the equivalent would be:
```javascript
const base = Div()
const title = P('Hello')
const test = Span('Test')

base.append(title, test)
```

To add styling, just use style objects:
So instead of
```html
<div class="some-style-class">
```
We'll have:
```javascript
base.cssClass({
  color: 'red',
  height: '20px'
})
```

