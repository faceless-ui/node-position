import React from 'react';
import PropTypes from 'prop-types';
import { WindowInfoProvider, WindowInfoContext } from '@trbl/react-window-info';
import { ScrollInfoProvider, ScrollInfoContext } from '@trbl/react-scroll-info';
import NodePositionContext from './context';

const NodePositionProvider = (props) => {
  const { children } = props;

  return (
    <WindowInfoProvider>
      <WindowInfoContext.Consumer>
        {(windowInfo) => (
          <ScrollInfoProvider>
            <ScrollInfoContext.Consumer>
              {(scrollInfo) => (
                <NodePositionContext.Provider
                  value={{
                    ...windowInfo,
                    ...scrollInfo,
                  }}
                >
                  {children && children}
                </NodePositionContext.Provider>
              )}
            </ScrollInfoContext.Consumer>
          </ScrollInfoProvider>
        )}
      </WindowInfoContext.Consumer>
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
