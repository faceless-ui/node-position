import React, { useState, useCallback } from 'react';
import { NodePositionProvider } from '../src'; // swap '../src' for '../dist/build.bundle' to demo production build
// import NodePositionDemo1 from './NodePosition1.demo';
// import NodePositionDemo2 from './NodePosition2.demo';
// import NodePositionDemo3 from './NodePosition3.demo';
// import NodePositionDemo4 from './NodePosition4.demo';
import UseNodePosition from './UseNodePosition.demo';
import WithNodePosition from './WithNodePosition.demo';

const AppDemo = () => {
  const [summaryContainer, setSummaryContainer] = useState(null);
  const setRef = useCallback((ref) => setSummaryContainer(ref), []);
  // const [height, setHeight] = useState('10px');

  return (
    <NodePositionProvider frameOffset={100}>
      <div
        ref={setRef}
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
      <UseNodePosition summaryContainer={summaryContainer} />
      <WithNodePosition summaryContainer={summaryContainer} />
      <div style={{ height: '100vh' }} />
      {/* <div
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
          summaryContainer={summaryContainer}
          style={{ height }}
        />
        <div style={{ width: '110vw', flexShrink: '0' }} />
      </div>
      <NodePositionDemo2 summaryContainer={summaryContainer} />
      <div style={{ whiteSpace: 'nowrap', marginTop: '300px' }}>
        <div style={{ width: '90vw', display: 'inline-block' }} />
        <NodePositionDemo3 summaryContainer={summaryContainer} />
        <div style={{ width: '110vw', display: 'inline-block' }} />
      </div>
      <div style={{ whiteSpace: 'nowrap', marginTop: '550px', marginBottom: '100vh' }}>
        <div style={{ width: '110vw', display: 'inline-block' }} />
        <NodePositionDemo4 summaryContainer={summaryContainer} />
        <div style={{ width: '150vw', display: 'inline-block' }} />
      </div> */}
    </NodePositionProvider>
  );
};

export default AppDemo;
