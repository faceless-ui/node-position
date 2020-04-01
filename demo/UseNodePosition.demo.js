import React, { useRef, Fragment } from 'react';
import { useNodePosition } from '../src'; // swap '../src' for '../dist/build.bundle' to demo production build

const UseNodePosition = () => {
  const ref = useRef();
  const nodePosition = useNodePosition(ref); // eslint-disable-line no-unused-vars
  console.log(nodePosition);

  return (
    <Fragment>
      <div
        ref={ref}
        style={{
          // paddingBottom: '200vh',
          background: 'lightcoral',
        }}
      >
        useNodePosition
      </div>
      <div style={{ height: '100vh' }} />
    </Fragment>
  );
};

export default UseNodePosition;
