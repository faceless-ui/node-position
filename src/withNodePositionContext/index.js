import React from 'react';
import { withWindowInfo } from '@trbl/react-window-info';
import { withScrollInfo } from '@trbl/react-scroll-info';
import NodePositionContext from '../NodePositionProvider/context';

const withNodePositionContext = (PassedComponent) => {
  const NodePositionContextWrap = (props) => {
    return (
      <NodePositionContext.Consumer>
        {(context) => {
          return (
            <PassedComponent
              {...{
                ...props,
                ...context,
              }}
            />
          );
        }}
      </NodePositionContext.Consumer>
    );
  };

  return withWindowInfo(withScrollInfo(NodePositionContextWrap));
};

export default withNodePositionContext;
