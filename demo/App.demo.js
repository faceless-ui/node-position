import React from 'react';
import { NodePositionProvider } from '../src'; // swap '../src' for '../dist/build.bundle' to demo production build
import NodePositionDemo1 from './NodePosition1.demo';
import NodePositionDemo2 from './NodePosition2.demo';

const AppDemo = () => {
  return (
    <NodePositionProvider frameOffset={100}>
      <NodePositionDemo1 demoProp="demo" />
      <div style={{ padding: '125vh 125vw', display: 'flex' }}>
        <NodePositionDemo2 />
      </div>
      <div
        style={{
          position: 'fixed',
          top: '100px',
          right: '100px',
          bottom: '100px',
          left: '100px',
          outline: 'dashed rgba(0, 0, 0, .15) 2px',
        }}
      />
    </NodePositionProvider>
  );
};

export default AppDemo;
