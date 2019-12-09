import React from 'react';
import PropTypes from 'prop-types';
import { WindowInfoProvider } from '@trbl/react-window-info';
import { ScrollInfoProvider } from '@trbl/react-scroll-info';
import NodeInfoContext from './context';
import defaultClassPrefix from '../defaultClassPrefix';

const NodeInfoProvider = (props) => {
  const {
    children,
    classPrefix,
  } = props;

  return (
    <WindowInfoProvider>
      <ScrollInfoProvider>
        <NodeInfoContext.Provider
          value={{
            classPrefix: classPrefix || defaultClassPrefix,
          }}
        >
          {children}
        </NodeInfoContext.Provider>
      </ScrollInfoProvider>
    </WindowInfoProvider>
  );
};

NodeInfoProvider.defaultProps = {
  classPrefix: '',
};

NodeInfoProvider.propTypes = {
  children: PropTypes.node.isRequired,
  classPrefix: PropTypes.string,
};

export default NodeInfoProvider;
