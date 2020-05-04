[![NPM](https://img.shields.io/npm/v/@trbl/react-node-position)](https://www.npmjs.com/@trbl/react-node-position)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/@trbl/react-node-position?label=zipped)
[![Supported by TRBL](https://img.shields.io/badge/supported_by-TRBL-black)](https://github.com/trouble)

# React Node Position

## Highlights

## Quick Start

### Installation

```bash
$ npm i @trbl/react-node-position
$ # or
$ yarn add @trbl/react-node-position
```

### Composition

```jsx
  import React from 'react';
  import { NodePositionProvider, withNodePosition } from '@trbl/react-node-position';

  const WithNodePosition = withNodePosition(forwardRef({ nodePosition }, ref) => <div ref={ref}>{nodePosition}</div>));

  const App = () => (
    <NodePositionProvider>
      <WithNodePosition />>
    </NodePositionProvider>
  )

  export default App;
```

For working examples, see the [demo app](./demo/App.demo.js).

## Demo

```bash
$ git clone git@github.com:trouble/react-node-position.git
$ yarn
$ yarn dev
$ open http://localhost:3000
```

## API

  - [NodePositionProvider](./src/NodePositionProvider/README.md)
  - [useNodePosition](./src/useNodePosition/README.md)
  - [withNodePosition](./src/withNodePosition/README.md)

## Contribution

[Help us,](https://github.com/trouble/.github/blob/master/CONTRIBUTING.md) or let us [help you help us](https://github.com/trouble/.github/blob/master/SUPPORT.md).

## License

[MIT](https://github.com/trouble/react-node-position/blob/master/LICENSE) Copyright (c) TRBL, LLC
