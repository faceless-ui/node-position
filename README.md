[![NPM](https://img.shields.io/npm/v/@trbl/react-node-position)](https://www.npmjs.com/@trbl/react-node-position)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/@trbl/react-node-position?label=zipped)
[![Supported by TRBL](https://img.shields.io/badge/supported_by-TRBL-black)](https://github.com/trouble)

# React Node Position

Send nodes.

## Quick Start

### Installation

```bash
$ yarn add @trbl/react-node-position
```

### Composition

```jsx
  import React from 'react';
  import { NodePositionProvider, withNodePosition } from '@trbl/react-node-position';

  const MyComponent = withNodePosition(forwardRef(props, ref) => return <div ref={ref}>My Component</div>));

  const App = () => {
    return (
      <NodePositionProvider>
        <MyComponent>
          ...
        </MyComponent>
      </NodePositionProvider>
    )
  }

  export default App;
```

## Demo

To demo locally, clone the repo and

```bash
$ yarn
$ yarn dev
$ open http://localhost:3000
```

## Documentation

All available props can be found via the references below:

  - [NodePositionProvider](./src/NodePositionProvider/README.md)
  - [withNodePosition](./src/withNodePosition/README.md)

## Contribution

[Help us,](https://github.com/trouble/.github/blob/master/CONTRIBUTING.md) or let us [help you help us](https://github.com/trouble/.github/blob/master/SUPPORT.md).

## License

[MIT](https://github.com/trouble/react-node-position/blob/master/LICENSE) Copyright (c) TRBL, LLC
