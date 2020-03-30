import React, { useState, useRef } from 'react';
import { NodePositionProvider } from '../src'; // swap '../src' for '../dist/build.bundle' to demo production build
import NodePositionDemo1 from './NodePosition1.demo';
import NodePositionDemo2 from './NodePosition2.demo';
import NodePositionDemo3 from './NodePosition3.demo';
import NodePositionDemo4 from './NodePosition4.demo';

const AppDemo = () => {
  const detailsContainer = useRef(null);
  const [height, setHeight] = useState('10px');

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
      <div
        style={{
          position: 'fixed',
          top: '100px',
          right: '100px',
          bottom: '100px',
          left: '100px',
          border: '1px dashed lightcoral',
        }}
      />
      <button
        style={{ position: 'fixed' }}
        onClick={() => setHeight('50vh')}
        type="button"
      >
        add height
      </button>
      <div style={{ height }} />
      <div style={{ display: 'flex', flexWrap: 'nowrap' }}>
        <div style={{ width: '50vw', height: '110vh', flexShrink: '0' }} />
        <NodePositionDemo1
          detailsContainer={detailsContainer}
          style={{ height }}
        />
        <div style={{ width: '110vw', flexShrink: '0' }} />
      </div>
      {/* <NodePositionDemo2 detailsContainer={detailsContainer} /> */}
      <div style={{ whiteSpace: 'nowrap', marginTop: '300px' }}>
        <div style={{ width: '90vw', display: 'inline-block' }} />
        {/* <NodePositionDemo3 detailsContainer={detailsContainer} /> */}
        <div style={{ width: '110vw', display: 'inline-block' }} />
      </div>
      <div style={{ whiteSpace: 'nowrap', marginTop: '550px', marginBottom: '100vh' }}>
        <div style={{ width: '110vw', display: 'inline-block' }} />
        {/* <NodePositionDemo4 detailsContainer={detailsContainer} /> */}
        <div style={{ width: '150vw', display: 'inline-block' }} />
      </div>
    </NodePositionProvider>
  );
};

export default AppDemo;
