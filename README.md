
<!-- 1 -->
# Base
A component based vanillajs library

## How to use
To create a component just use:
```javascript
// Component child.js
const base = Base()
// or
const base = Div('Hi')

return base
```
Once we exported this component, we can import and use it inside another component:
```javascript
// Component parent.js
import { Child } from './child'

const base = Base()
const child = Child()
base.append(child)

return base
// will be rendered as <div><div>Hi</div><div/>
```

Examples of difference with a regular html/js code:
```html
<div>
    <p>Hello</p>
    <span>Test</span>
</div>
```
The equivalent in html would be
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

