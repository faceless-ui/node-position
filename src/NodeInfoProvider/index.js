import React from 'react';
import PropTypes from 'prop-types';
import { WindowInfoProvider } from '@trbl/react-window-info';
import { ScrollInfoProvider } from '@trbl/react-scroll-info';

const NodeInfoProvider = (props) => {
  const { children } = props;

  return (
    <WindowInfoProvider>
      <ScrollInfoProvider>
        {children}
      </ScrollInfoProvider>
    </WindowInfoProvider>
  );
};

NodeInfoProvider.defaultProps = {};

NodeInfoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NodeInfoProvider;
