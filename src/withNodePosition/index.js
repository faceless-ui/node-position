import React, { useRef } from 'react';
import useNodePosition from '../useNodePosition';

const withNodePosition = (PassedComponent) => {
  const NodePositionWrap = (props) => {
    const ref = useRef();
    const nodePosition = useNodePosition(ref);
    return (
      <PassedComponent
        {...{
          ...props,
          ref,
          nodePosition,
        }}
      />
    );
  };
  return NodePositionWrap;
};

export default withNodePosition;
