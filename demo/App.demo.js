import React from 'react';
import { NodeInfoProvider } from '../src'; // swap '../src' for '../dist/build.bundle' to demo production build
import NodeInfoDemo1 from './NodeInfo1.demo';
import NodeInfoDemo2 from './NodeInfo2.demo';

const AppDemo = () => {
  return (
    <NodeInfoProvider frameOffset={100}>
      <NodeInfoDemo1 demoProp="demo" />
      <div style={{ padding: '125vh 125vw', display: 'flex' }}>
        <NodeInfoDemo2 />
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
    </NodeInfoProvider>
  );
};

export default AppDemo;
