import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import NodePositionContext from '../NodePositionProvider/context';

const defaultOptions = {
  root: null,
  rootMargin: '0px',
  trackOutOfFrame: false,
  intersectionThreshold: 0,
};

const withNodePosition = (PassedComponent, options) => {
  class Node extends Component {
    constructor() {
      super();

      this.nodeRef = createRef();
      this.observer = null;

      this.options = {
        ...defaultOptions,
        ...options,
      };

      this.initialState = {
        nodeRect: {
          width: 0,
          height: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        intersectionRect: {
          width: 0,
          height: 0,
        },
        isIntersectingPlaneX: false,
        isIntersectingPlaneY: false,
        isIntersecting: false,
        intersectionRatio: 0,
        xIntersectionRatio: 0,
        yIntersectionRatio: 0,
        xPlaneIntersectionRatio: 0,
        yPlaneIntersectionRatio: 0,
        xDisplacementRatio: 0,
        yDisplacementRatio: 0,
        displacementRatio: 0,
      };

      this.state = {
        ...this.initialState,
        totalOffsetLeft: 0,
        totalOffsetTop: 0,
        intersectionObserverIsSupported: false,
      };
    }

    componentDidMount() {
      const intersectionObserverIsSupported = 'IntersectionObserver' in window
        && 'IntersectionObserverEntry' in window
        && 'intersectionRatio' in window.IntersectionObserverEntry.prototype;

      if (intersectionObserverIsSupported) {
        this.observer = new IntersectionObserver(this.handleIntersectionEvent, {
          root: this.options.root,
          rootMargin: this.options.rootMargin,
          threshold: this.options.intersectionThreshold,
        });

        this.observer.observe(this.nodeRef.current);

        this.setState({ intersectionObserverIsSupported });
      }
    }

    componentDidUpdate(prevProps) {
      const { scrollInfo, windowInfo } = this.props;
      const { isIntersecting, intersectionObserverIsSupported } = this.state;
      const windowEventFired = windowInfo.eventsFired !== prevProps.windowInfo.eventsFired;
      const scrollEventFired = scrollInfo.eventsFired !== prevProps.scrollInfo.eventsFired;

      if (windowEventFired) this.queryNodePosition();

      if (scrollEventFired) {
        // Respond to the scroll event...
        // if the browser supports the IntersectionObserver API,
        // or if the passed options have opted-in to node tracking while outside the frame,
        // or if the node is currently intersecting its frame.
        if (!intersectionObserverIsSupported || this.options.trackOutOfFrame || isIntersecting) this.handleScrollEvent();
        // Otherwise, prune the stale node positions.
        else if (intersectionObserverIsSupported && !this.options.trackOutOfFrame && !isIntersecting) this.resetState();
      }
    }

    componentWillUnmount() {
      const { intersectionObserverIsSupported } = this.state;
      if (intersectionObserverIsSupported) this.observer.unobserve(this.nodeRef.current);
    }

    handleScrollEvent = () => {
      const { scrollInfo } = this.props;

      // The getBoundingClientRect received on mount in Chrome is calculated relative to the cached scroll position (if present),
      // so tracking against it before the first scroll event would lead to de-synchronization unless queryNodePosition
      // is run on the first scroll event, which allows for accurate, safe tracking on all subsequent events.
      if (scrollInfo.eventsFired <= 1) this.queryNodePosition();
      else this.trackNodePosition();
    }

    // true position
    handleIntersectionEvent = (entries) => {
      console.log('intersect');
      const {
        rootBounds: frameRect,
        boundingClientRect: nodeRect,
      } = entries[0];

      this.setState({
        frameRect,
        nodeRect,
        ...this.getIntersectionInfo(frameRect, nodeRect),
        ...this.getDisplacementInfo(frameRect, nodeRect),
        ...this.getTotalNodeOffsets(nodeRect),
      });
    }

    // true position
    queryNodePosition = () => {
      console.log('query');
      const { windowInfo } = this.props;
      const { current: node } = this.nodeRef;

      if (node) {
        const frameOffset = 0; // TODO: parse the rootMargin option property instead

        const frameRect = {
          width: windowInfo.width - (frameOffset * 2),
          height: windowInfo.height - (frameOffset * 2),
          top: frameOffset,
          right: frameOffset ? windowInfo.width - frameOffset : windowInfo.width,
          bottom: frameOffset ? windowInfo.height - frameOffset : windowInfo.height,
          left: frameOffset,
        };

        const nodeRect = node.getBoundingClientRect(); // relative to the viewport

        this.setState({
          frameRect,
          nodeRect,
          ...this.getIntersectionInfo(frameRect, nodeRect),
          ...this.getDisplacementInfo(frameRect, nodeRect),
          ...this.getTotalNodeOffsets(nodeRect),
        });
      }
    }

    // synthetic (calculated) position
    trackNodePosition = () => {
      console.log('track');
      const { scrollInfo } = this.props;
      const { nodeRect, frameRect } = this.state;

      const trackedNodeRect = {
        // TODO: consider adjusting the newNodeRect to account for potential changes in the node dimensions.
        // i.e. if the node's width or height changed at any point during synthetic tracking, these tracked values become inaccurate.
        // A performance hit for this feature is the necessary use of the clientWidth and clientHeight methods on every scroll.
        width: nodeRect.width,
        height: nodeRect.height,
        top: nodeRect.top - scrollInfo.yDifference,
        right: nodeRect.right - scrollInfo.xDifference,
        bottom: nodeRect.bottom - scrollInfo.yDifference,
        left: nodeRect.left - scrollInfo.xDifference,
      };

      this.setState({
        nodeRect: trackedNodeRect,
        ...this.getIntersectionInfo(frameRect, nodeRect),
        ...this.getDisplacementInfo(frameRect, nodeRect),
      });
    }

    getIntersectionInfo = (frameRect, nodeRect) => {
      const isContainedInPlaneX = nodeRect.right > frameRect.left && nodeRect.right < frameRect.right;
      const isContainedInPlaneY = nodeRect.bottom > frameRect.top && nodeRect.bottom < frameRect.bottom;

      const intersectionRect = {
        width: 0,
        height: 0,
        // top: 0, TODO: support this property
        // right: 0, TODO: support this property
        // bottom: 0, TODO: support this property
        // left: 0, TODO: support this property
      };

      if (isContainedInPlaneX) { // TODO: simplify this logic or make it more readable
        if (nodeRect.left >= frameRect.left) intersectionRect.width = nodeRect.right - nodeRect.left;
        else intersectionRect.width = nodeRect.right;
      } else if (nodeRect.right > frameRect.right && nodeRect.left < frameRect.right) {
        if (nodeRect.left <= frameRect.right) intersectionRect.width = frameRect.right - nodeRect.left;
        else intersectionRect.width = frameRect.right;
      }

      if (isContainedInPlaneY) { // TODO: simplify this logic or make it more readable
        if (nodeRect.top >= frameRect.top) intersectionRect.height = nodeRect.bottom - nodeRect.top;
        else intersectionRect.height = nodeRect.bottom;
      } else if (nodeRect.bottom > frameRect.bottom && nodeRect.top < frameRect.bottom) {
        if (nodeRect.top <= frameRect.bottom) intersectionRect.height = frameRect.bottom - nodeRect.top;
        else intersectionRect.height = frameRect.bottom;
      }

      const isIntersectingPlaneX = intersectionRect.width > 0;
      const isIntersectingPlaneY = intersectionRect.height > 0;
      const isIntersectingBothPlanes = isIntersectingPlaneX && isIntersectingPlaneY;

      const xPlaneIntersectionRatio = intersectionRect.width / nodeRect.width || 0; // fallback to 0 for cases where 0/0 === NaN
      const yPlaneIntersectionRatio = intersectionRect.height / nodeRect.height || 0; // fallback to 0 for cases where 0/0 === NaN

      const xIntersectionRatio = isIntersectingBothPlanes ? xPlaneIntersectionRatio : 0;
      const yIntersectionRatio = isIntersectingBothPlanes ? yPlaneIntersectionRatio : 0;
      const intersectionRatio = (xIntersectionRatio + yIntersectionRatio) / 2;

      return {
        intersectionRect,
        isIntersectingPlaneX,
        isIntersectingPlaneY,
        isIntersecting: isIntersectingBothPlanes,
        intersectionRatio,
        xIntersectionRatio,
        yIntersectionRatio,
        xPlaneIntersectionRatio,
        yPlaneIntersectionRatio,
      };
    }

    getDisplacementInfo = (frameRect, nodeRect) => {
      const xTrackLength = frameRect.width + nodeRect.width;
      const xDistanceToTravel = nodeRect.right - frameRect.left;
      const xDisplacementRatio = (xDistanceToTravel / xTrackLength) || 0; // conditional assignment for cases where 0 / 0 === NaN

      const yTrackLength = frameRect.height + nodeRect.height;
      const yDistanceToTravel = nodeRect.bottom - frameRect.top;
      const yDisplacementRatio = (yDistanceToTravel / yTrackLength) || 0; // conditional assignment for cases where 0 / 0 === NaN

      const displacementRatio = (xDisplacementRatio + yDisplacementRatio) / 2;

      return {
        xDisplacementRatio,
        yDisplacementRatio,
        displacementRatio,
      };
    }

    getTotalNodeOffsets = (nodeRect) => {
      const { scrollInfo } = this.props;
      return {
        totalOffsetLeft: scrollInfo.x + nodeRect.left,
        totalOffsetTop: scrollInfo.y + nodeRect.top,
      };
    }

    resetState = () => {
      this.setState({ ...this.initialState });
    }

    render() {
      const passedState = { ...this.state };
      delete passedState.intersectionObserverIsSupported;

      return (
        <PassedComponent
          ref={this.nodeRef}
          nodePosition={{ ...passedState }}
          {...this.props}
        />
      );
    }
  }

  Node.propTypes = {
    scrollInfo: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      xDifference: PropTypes.number,
      yDifference: PropTypes.number,
      eventsFired: PropTypes.number,
    }).isRequired,
    windowInfo: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      eventsFired: PropTypes.number,
    }).isRequired,
  };

  return (props) => (
    <NodePositionContext.Consumer>
      {(nodePositionContext) => (
        <Node
          {...{
            ...props,
            ...nodePositionContext,
          }}
        />
      )}
    </NodePositionContext.Consumer>
  );
};

export default withNodePosition;
