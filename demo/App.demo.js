import React from 'react';
import { NodeInfoProvider } from '../src'; // swap '../src' for '../dist/build.bundle' to demo production build
import NodeInfoDemo1 from './NodeInfo1.demo';
import NodeInfoDemo2 from './NodeInfo2.demo';

const AppDemo = () => {
  return (
    <NodeInfoProvider classPrefix="demo">
      <NodeInfoDemo1 demoProp="demo" />
      <div style={{ padding: '125vh 125vw', display: 'flex' }}>
        <NodeInfoDemo2 />
      </div>
    </NodeInfoProvider>
  );
};

export default AppDemo;
