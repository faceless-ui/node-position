import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { WindowInfoProvider, WindowInfoContext } from '@trbl/react-window-info';
import { ScrollInfoProvider, ScrollInfoContext } from '@trbl/react-scroll-info';
import ResizeObserver from 'resize-observer-polyfill';

import NodePositionContext from './context';

class NodePositionProvider extends Component {
  constructor() {
    super();

    this.canUseResizeObserver = false;
    this.resizeObserver = null;

    this.state = {
      documentInfo: {
        width: 0,
        height: 0,
        eventsFired: 0,
      },
    };
  }

  componentDidMount() {
    this.canUseResizeObserver = 'ResizeObserver' in window;

    if (this.canUseResizeObserver) {
      this.resizeObserver = new ResizeObserver(this.handleResizeEvent);
      this.resizeObserver.observe(document.documentElement, { box: 'border-box' });
    }
  }

  componentWillUnmount() {
    if (this.canUseResizeObserver) this.resizeObserver.unobserve(document.documentElement);
  }

  handleResizeEvent = (entries) => {
    const { contentRect: { width, height } } = entries[0];
    this.setState((state) => ({
      documentInfo: {
        width,
        height,
        eventsFired: state.eventsFired + 1,
      },
    }));
  }

  render() {
    const { children } = this.props;

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
                      ...this.state,
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
  }
}

NodePositionProvider.defaultProps = {
  children: undefined,
};

NodePositionProvider.propTypes = {
  children: PropTypes.node,
};

export default NodePositionProvider;
