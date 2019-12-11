import React from 'react';
import PropTypes from 'prop-types';
import { WindowInfoProvider } from '@trbl/react-window-info';
import { ScrollInfoProvider } from '@trbl/react-scroll-info';
import NodePositionContext from './context';

const NodePositionProvider = (props) => {
  const {
    children,
    frameOffset,
  } = props;

  return (
    <WindowInfoProvider>
      <ScrollInfoProvider>
        <NodePositionContext.Provider value={{ frameOffset }}>
          {children}
        </NodePositionContext.Provider>
      </ScrollInfoProvider>
    </WindowInfoProvider>
  );
};

NodePositionProvider.defaultProps = {
  frameOffset: 0,
};

NodePositionProvider.propTypes = {
  children: PropTypes.node.isRequired,
  frameOffset: PropTypes.number,
};

export default NodePositionProvider;
