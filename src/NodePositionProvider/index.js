import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { WindowInfoProvider } from '@trbl/react-window-info';
import { ScrollInfoProvider } from '@trbl/react-scroll-info';
import NodePositionContext from './context';

const NodePositionProvider = (props) => {
  const {
    children,
    frameOffset,
    scrollInfoOverride,
    windowInfoOverride,
  } = props;

  const WindowInfoProviderComponent = windowInfoOverride ? Fragment : WindowInfoProvider;
  const ScrollInfoProviderComponent = scrollInfoOverride ? Fragment : ScrollInfoProvider;

  const nodePositionContext = { frameOffset };
  if (windowInfoOverride) nodePositionContext.windowInfo = { ...windowInfoOverride.windowInfo };
  if (scrollInfoOverride) nodePositionContext.scrollInfo = { ...scrollInfoOverride.scrollInfo };

  return (
    <WindowInfoProviderComponent>
      <ScrollInfoProviderComponent>
        <NodePositionContext.Provider
          value={nodePositionContext}
        >
          {children}
        </NodePositionContext.Provider>
      </ScrollInfoProviderComponent>
    </WindowInfoProviderComponent>
  );
};

NodePositionProvider.defaultProps = {
  frameOffset: 0,
};

NodePositionProvider.propTypes = {
  frameOffset: PropTypes.number,
  children: PropTypes.node.isRequired,
  scrollInfoOverride: PropTypes.shape({
    scrollInfo: PropTypes.shape({}),
  }).isRequired,
  windowInfoOverride: PropTypes.shape({
    windowInfo: PropTypes.shape({}),
  }).isRequired,
};

export default NodePositionProvider;
