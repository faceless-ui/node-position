import React, { createRef } from 'react';
import { NodePositionProvider } from '../src'; // swap '../src' for '../dist/build.bundle' to demo production build
import NodePositionDemo1 from './NodePosition1.demo';
import NodePositionDemo2 from './NodePosition2.demo';
import NodePositionDemo3 from './NodePosition3.demo';

const AppDemo = () => {
  const detailsContainer = createRef(null);

  return (
    <NodePositionProvider frameOffset={100}>
      <div
        ref={detailsContainer}
        id="details-container"
        style={{
          padding: '10px',
          position: 'fixed',
          top: '0',
          left: '0',
          height: '100%',
          overflow: 'scroll',
        }}
      />
      <div style={{ height: '110vh' }} />
      <NodePositionDemo1 detailsContainer={detailsContainer} />
      <div style={{ whiteSpace: 'nowrap', marginTop: '300px' }}>
        <div style={{ width: '90vw', display: 'inline-block' }} />
        {/* <NodePositionDemo2 detailsContainer={detailsContainer} /> */}
        <div style={{ width: '110vw', display: 'inline-block' }} />
      </div>
      <div style={{ whiteSpace: 'nowrap', marginTop: '550px', marginBottom: '100vh' }}>
        <div style={{ width: '110vw', display: 'inline-block' }} />
        {/* <NodePositionDemo3 detailsContainer={detailsContainer} /> */}
        <div style={{ width: '150vw', display: 'inline-block' }} />
      </div>
    </NodePositionProvider>
  );
};

export default AppDemo;
