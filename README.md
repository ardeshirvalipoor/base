# Base: High Performance Component Library
A lightweight, high-performance component-based library, built with vanilla JavaScript for seamless web development.

## Features
- No dependencies
- Easy to learn and use
- Optimal performance
- Supports component nesting
- Encourages modular and reusable code

## Getting Started
Creating components with Base is simple and straightforward:

### Creating a Component
```
// Component child.js
const base = Base('div');
// or
const base = Div('Hi');

return base;
```

### Importing and Using Components
```
// Component parent.js
import { Child } from './child';

const base = Base('div');
const child = Child();
base.append(child);

return base;
// Will be rendered as <div><div>Hi</div></div>
```

### Differences from Standard HTML/JS
Example with regular HTML/JS code:
```
<div>
    <p>Hello</p>
    <span>Test</span>
</div>
````
Equivalent example with Base:
```
const base = Div();
const title = P('Hello');
const test = Span('Test');

base.append(title, test)
```
## Styling Components
Easily apply CSS styles to components using style objects:

### HTML with CSS class
```
<div class="some-style-class">
```

### Base with style object
```
base.cssClass({
  color: 'red',
  height: '20px'
});
```

## Documentation
For a comprehensive guide on how to use Base and its components, please refer to the [official documentation](https://github.com/ardeshirvalipoor/base/wiki).

## Contributing
We welcome contributions to improve and expand Base! Please follow the [contribution guidelines](https://github.com/ardeshirvalipoor/base/blob/main/CONTRIBUTING.md) to get started.

## License
Base is released under the [MIT License](https://github.com/yourusername/base-library/blob/main/LICENSE).
