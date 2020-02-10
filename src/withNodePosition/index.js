import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import NodePositionContext from '../NodePositionProvider/context';

const defaultOptions = { // TODO: Type-check this options object
  root: null,
  rootMargin: '0px',
  // This option is only recognized within browsers that support the IntersectionObserver API.
  // Since it is merely a performance boost, its absence will not cause breakage or require an implementation change.
  reportScrollEvents: 'never',
  // This option is only recognized when "reportScrollEvents" is not equal to "always" or "whenVisible",
  // since these two options report the node position parallel to intersection events.
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
        isVisible: false,
        xVisibility: 0,
        yVisibility: 0,
        visibility: 0,
        xPlaneVisibility: 0,
        yPlaneVisibility: 0,
        isVisibleInPlaneX: false,
        isVisibleInPlaneY: false,
        xDisplacement: 0,
        yDisplacement: 0,
        displacement: 0,
      };

      this.state = {
        clippingMask: {
          width: 0,
          height: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
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
        const {
          root,
          rootMargin,
          intersectionThreshold,
          reportScrollEvents,
        } = this.options;

        this.observer = new IntersectionObserver(this.handleIntersectionEvent, {
          root,
          rootMargin,
          threshold: reportScrollEvents !== 'always' || reportScrollEvents !== 'whenVisible' ? intersectionThreshold : 0,
        });

        this.observer.observe(this.nodeRef.current);

        this.setState({ intersectionObserverIsSupported });
      }
    }

    componentDidUpdate(prevProps) {
      const { reportScrollEvents } = this.options;
      const { scrollInfo, windowInfo } = this.props;
      const { isVisible, intersectionObserverIsSupported } = this.state;

      const scrollEventHasFired = prevProps.scrollInfo.eventsFired !== scrollInfo.eventsFired;
      const windowEventHasFired = prevProps.windowInfo.eventsFired !== windowInfo.eventsFired;

      if (windowEventHasFired) this.queryNodePosition();

      if (scrollEventHasFired) {
        if (
          !intersectionObserverIsSupported
          || reportScrollEvents === 'always'
          || (!isVisible && reportScrollEvents === 'whenInvisible')
          || (isVisible && reportScrollEvents === 'whenVisible')
        ) this.handleScrollEvent();
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
      const {
        rootBounds: clippingMask,
        boundingClientRect: nodeRect,
        isIntersecting: isVisible,
      } = entries[0];

      this.setState({
        clippingMask,
        nodeRect,
        ...this.calculateIntersection(clippingMask, nodeRect, isVisible),
        ...this.calculateDisplacement(clippingMask, nodeRect),
        ...this.calculateTotalNodeOffsets(nodeRect),
      });
    }

    // true position
    queryNodePosition = () => {
      const { windowInfo } = this.props;
      const { current: node } = this.nodeRef;

      if (node) {
        const frameOffset = 0; // TODO: parse the rootMargin option property instead

        const clippingMask = {
          width: windowInfo.width - (frameOffset * 2),
          height: windowInfo.height - (frameOffset * 2),
          top: frameOffset,
          right: frameOffset ? windowInfo.width - frameOffset : windowInfo.width,
          bottom: frameOffset ? windowInfo.height - frameOffset : windowInfo.height,
          left: frameOffset,
        };

        const nodeRect = node.getBoundingClientRect(); // relative to the viewport

        this.setState({
          clippingMask,
          nodeRect,
          ...this.calculateIntersection(clippingMask, nodeRect),
          ...this.calculateDisplacement(clippingMask, nodeRect),
          ...this.calculateTotalNodeOffsets(nodeRect),
        });
      }
    }

    // synthetic (calculated) position
    trackNodePosition = () => {
      const { scrollInfo } = this.props;
      const { nodeRect, clippingMask } = this.state;

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
        ...this.calculateIntersection(clippingMask, nodeRect),
        ...this.calculateDisplacement(clippingMask, nodeRect),
      });
    }

    calculateIntersection = (clippingMask, nodeRect, incomingVisibilityStatus) => {
      const planeIntersectionRect = { width: 0, height: 0 };

      const nodeSideIsInPlaneY = (rectSide) => rectSide >= clippingMask.left && rectSide <= clippingMask.right;
      const nodeIsContainedInPlaneY = nodeSideIsInPlaneY(nodeRect.right) && nodeSideIsInPlaneY(nodeRect.left);
      const nodeSpansPlaneY = nodeRect.left < clippingMask.left && nodeRect.right > clippingMask.right;
      const nodeStraddlesFrameLeft = nodeSideIsInPlaneY(nodeRect.right) && nodeRect.left <= clippingMask.left;
      const nodeStraddlesFrameRight = nodeSideIsInPlaneY(nodeRect.left) && nodeRect.right >= clippingMask.right;

      if (nodeIsContainedInPlaneY) planeIntersectionRect.width = nodeRect.width;
      if (nodeStraddlesFrameLeft) planeIntersectionRect.width = nodeRect.right;
      if (nodeStraddlesFrameRight) planeIntersectionRect.width = clippingMask.right - nodeRect.left;
      if (nodeSpansPlaneY) planeIntersectionRect.width = clippingMask.width;

      const nodeSideIsInPlaneX = (rectSide) => rectSide >= clippingMask.top && rectSide <= clippingMask.bottom;
      const nodeIsContainedInPlaneX = nodeSideIsInPlaneX(nodeRect.top) && nodeSideIsInPlaneX(nodeRect.bottom);
      const nodeSpansPlaneX = nodeRect.top < clippingMask.top && nodeRect.bottom > clippingMask.bottom;
      const nodeStraddlesFrameTop = nodeSideIsInPlaneX(nodeRect.bottom) && nodeRect.top <= clippingMask.top;
      const nodeStraddlesFrameBottom = nodeSideIsInPlaneX(nodeRect.top) && nodeRect.bottom >= clippingMask.bottom;

      if (nodeIsContainedInPlaneX) planeIntersectionRect.height = nodeRect.height;
      if (nodeStraddlesFrameTop) planeIntersectionRect.height = nodeRect.bottom;
      if (nodeStraddlesFrameBottom) planeIntersectionRect.height = clippingMask.height - nodeRect.top;
      if (nodeSpansPlaneX) planeIntersectionRect.height = clippingMask.height;

      const xPlaneVisibility = planeIntersectionRect.height / nodeRect.height || 0;
      const yPlaneVisibility = planeIntersectionRect.width / nodeRect.width || 0;

      const isVisibleInPlaneX = xPlaneVisibility > 0;
      const isVisibleInPlaneY = yPlaneVisibility > 0;

      // The incomingVisibilityStatus argument is needed here to account for when the Intersection Observer
      // triggers this method with either isVisibleInPlaneX or isVisibleInPlaneY of zero, leading the isVisible state to become false
      // and ultimately fail the conditions within componentDidUpdate that allow the scroll event to take over.
      // This approach creates two sources of truth for the isVisible state, so there may be room for improvement here (isIdle?).
      const isVisible = incomingVisibilityStatus !== undefined
        ? incomingVisibilityStatus
        : isVisibleInPlaneX && isVisibleInPlaneY;

      const xVisibility = isVisible ? xPlaneVisibility : 0;
      const yVisibility = isVisible ? yPlaneVisibility : 0;
      const visibility = isVisible ? (xVisibility + yVisibility) / 2 : 0;

      return {
        intersectionRect: {
          width: isVisible ? planeIntersectionRect.width : 0,
          height: isVisible ? planeIntersectionRect.height : 0,
        },
        isVisible,
        xVisibility,
        yVisibility,
        visibility,
        xPlaneVisibility,
        yPlaneVisibility,
        isVisibleInPlaneX,
        isVisibleInPlaneY,
      };
    }

    calculateDisplacement = (clippingMask, nodeRect) => {
      const xTrackLength = clippingMask.width + nodeRect.width;
      const xDisplacedPixels = nodeRect.right - clippingMask.left;
      const xDisplacement = (xDisplacedPixels / xTrackLength) || 0;

      const yTrackLength = clippingMask.height + nodeRect.height;
      const yDisplacedPixels = nodeRect.bottom - clippingMask.top;
      const yDisplacement = (yDisplacedPixels / yTrackLength) || 0;

      const displacement = (xDisplacement + yDisplacement) / 2;

      return {
        xDisplacement,
        yDisplacement,
        displacement,
      };
    }

    calculateTotalNodeOffsets = (nodeRect) => {
      const { scrollInfo } = this.props;
      return {
        totalOffsetLeft: scrollInfo.x + nodeRect.left,
        totalOffsetTop: scrollInfo.y + nodeRect.top,
      };
    }

    pruneStale = () => {
      const { isReset } = this.state;

      if (!isReset) {
        this.setState({
          ...this.initialState,
          isReset: true,
        });
      }
    }

    render() {
      const passedProps = { ...this.props };
      delete passedProps.scrollInfo;
      delete passedProps.windowInfo;

      const passedState = { ...this.state };
      delete passedState.intersectionObserverIsSupported;

      return (
        <PassedComponent
          ref={this.nodeRef}
          {...{
            nodePosition: { ...passedState },
            ...passedProps,
          }}
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
