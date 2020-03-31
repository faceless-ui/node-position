import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WindowInfoProvider } from '@trbl/react-window-info';
import { ScrollInfoProvider } from '@trbl/react-scroll-info';
import ResizeObserver from 'resize-observer-polyfill';

import NodePositionContext from './context';

class NodePositionProvider extends Component {
  constructor() {
    super();

    this.resizeObserver = null;

    this.state = {
      width: 0,
      height: 0,
      eventsFired: 0,
      canUseResizeObserver: false,
    };
  }

  componentDidMount() {
    const canUseResizeObserver = 'ResizeObserver' in window;

    if (canUseResizeObserver) {
      this.resizeObserver = new ResizeObserver(this.handleResizeEvent);
      this.resizeObserver.observe(document.documentElement, { box: 'border-box' });
      this.setState({ canUseResizeObserver });
    }
  }

  componentWillUnmount() {
    const { canUseResizeObserver } = this.state;
    if (canUseResizeObserver) this.resizeObserver.unobserve(document.documentElement);
  }

  handleResizeEvent = (entries) => {
    const { contentRect: { width, height } } = entries[0];
    this.setState((state) => ({
      width,
      height,
      eventsFired: state.eventsFired + 1,
    }));
  }

  render() {
    const { children } = this.props;

    return (
      <WindowInfoProvider>
        <ScrollInfoProvider>
          <NodePositionContext.Provider
            value={{
              documentInfo: {
                ...this.state,
              },
            }}
          >
            {children && children}
          </NodePositionContext.Provider>
        </ScrollInfoProvider>
      </WindowInfoProvider>
    );
  }
}

NodePositionProvider.defaultProps = {
  children: undefined,
};

NodePositionProvider.propTypes = {
  children: PropTypes.node,
};

export default NodePositionProvider;
