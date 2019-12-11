import React from 'react';
import PropTypes from 'prop-types';
import { WindowInfoProvider } from '@trbl/react-window-info';
import { ScrollInfoProvider } from '@trbl/react-scroll-info';
import NodeInfoContext from './context';

const NodeInfoProvider = (props) => {
  const {
    children,
    frameOffset,
  } = props;

  return (
    <WindowInfoProvider>
      <ScrollInfoProvider>
        <NodeInfoContext.Provider value={{ frameOffset }}>
          {children}
        </NodeInfoContext.Provider>
      </ScrollInfoProvider>
    </WindowInfoProvider>
  );
};

NodeInfoProvider.defaultProps = {
  frameOffset: 0,
};

NodeInfoProvider.propTypes = {
  children: PropTypes.node.isRequired,
  frameOffset: PropTypes.number,
};

export default NodeInfoProvider;
