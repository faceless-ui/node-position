import React from 'react';
import PropTypes from 'prop-types';
import { WindowInfoProvider } from '@trbl/react-window-info';
import { ScrollInfoProvider } from '@trbl/react-scroll-info';
import NodePositionContext from './context';

const NodePositionProvider = (props) => {
  const { children } = props;

  return (
    <WindowInfoProvider>
      <ScrollInfoProvider>
        <NodePositionContext.Provider>
          {children && children}
        </NodePositionContext.Provider>
      </ScrollInfoProvider>
    </WindowInfoProvider>
  );
};

NodePositionProvider.defaultProps = {
  children: undefined,
};

NodePositionProvider.propTypes = {
  children: PropTypes.node,
};

export default NodePositionProvider;
