[![NPM](https://img.shields.io/npm/v/@trbl/react-node-info)](https://www.npmjs.com/@trbl/react-node-info)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/@trbl/react-node-info?label=zipped)
[![Supported by TRBL](https://img.shields.io/badge/supported_by-TRBL-black)](https://github.com/trouble)

# React Node Info

Send nodes.

## Quick Start

### Installation

```bash
$ yarn add @trbl/react-node-info
```

### Compositon

```jsx
  import React from 'react';
  import { NodeInfoProvider, withNodeInfo } from '@trbl/react-node-info';

  const MyComponent = withNodeInfo(forwardRef(props, ref) => return <div ref={ref}>My Component</div>));

  const App = () => {
    return (
      <NodeInfoProvider>
        <MyComponent>
          ...
        </MyComponent>
      </NodeInfoProvider>
    )
  }

  export default App;
```

## Demo

To demo locally, clone the repo and

```bash
$ yarn install
$ npm run dev
$ open http://localhost:3000
```

## Documentation

All available props can be found via the references below:

  - [NodeInfoProvider](/src/NodeInfoProvider/README.md)
  - [withNodeInfo](/src/withNodeInfo/README.md)

## License

[MIT](https://github.com/trouble/react-node-info/blob/master/LICENSE) Copyright (c) TRBL, LLC
