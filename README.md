
<!-- 1 -->
# Base
A component based vanillajs library

## How to use
To create a component just use:
```javascript
// Component child.js
const base = Base()
// or
consr base = Div('Hi')
```
Example:
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
We'll have
```javascript
base.cssClass({
  color: 'red',
  height: '20px'
})
```

Once we exported this component, we can import that inside another component:
```javascript
// Component parent.js
const base = Base()
const child = Child()
base.append(child)
// will be rendered as <parent><child/><parent/>
```