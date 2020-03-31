import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import ResizeObserver from 'resize-observer-polyfill';
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

      this.canUseResizeObserver = false;
      this.resizeObserver = null;
      this.resizeObserverIsInitialized = false;

      this.canUseIntersectionObserver = false;
      this.intersectionObserver = null;
      this.intersectionObserverIsInitialized = false;

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
      };
    }

    componentDidMount() {
      console.warn('mount');
      this.canUseResizeObserver = 'ResizeObserver' in window;
      this.canUseIntersectionObserver = 'IntersectionObserver' in window
        && 'IntersectionObserverEntry' in window
        && 'intersectionRatio' in window.IntersectionObserverEntry.prototype;

      if (this.canUseResizeObserver) this.setupResizeObserver();
      if (this.canUseIntersectionObserver) this.setupIntersectionObserver();
    }

    componentDidUpdate(prevProps) {
      console.warn('did update');
      const {
        windowInfo,
        scrollInfo,
        documentInfo,
      } = this.props;

      if (prevProps.windowInfo.eventsFired !== windowInfo.eventsFired) this.handleWindowResize();
      if (prevProps.scrollInfo.eventsFired !== scrollInfo.eventsFired) this.handleScrollEvent();
      if (prevProps.documentInfo.eventsFired !== documentInfo.eventsFired) this.handleDocumentResize();
    }

    componentWillUnmount() {
      if (this.canUseIntersectionObserver) this.intersectionObserver.unobserve(this.nodeRef.current);
      if (this.canUseResizeObserver) this.resizeObserver.unobserve(this.nodeRef.current);
    }

    setupResizeObserver = () => {
      this.resizeObserver = new ResizeObserver(this.handleNodeResize);
      this.resizeObserver.observe(this.nodeRef.current, { box: 'border-box' });
    }

    setupIntersectionObserver = () => {
      const shouldSetThreshold = this.options.reportScrollEvents !== 'always' || this.options.reportScrollEvents !== 'whenVisible';

      this.intersectionObserver = new IntersectionObserver(
        this.handleIntersectionEvent,
        {
          // root: this.options.root, this property can be enabled in a future enhancement
          root: null,
          rootMargin: this.options.rootMargin,
          threshold: shouldSetThreshold ? this.options.intersectionThreshold : 0,
        },
      );

      this.intersectionObserver.observe(this.nodeRef.current);
    }

    handleScrollEvent = () => {
      console.log('handle scroll event');
      const { reportScrollEvents } = this.options;
      const { scrollInfo } = this.props;
      const { nodeRect, isVisible, clippingMask } = this.state;

      const shouldRespondToScrollEvent = (
        !this.canUseIntersectionObserver
        || reportScrollEvents === 'always'
        || (!isVisible && reportScrollEvents === 'whenInvisible')
        || (isVisible && reportScrollEvents === 'whenVisible')
      );

      if (shouldRespondToScrollEvent) {
        const nodeRectAfterScroll = {
          width: nodeRect.width,
          height: nodeRect.height,
          top: nodeRect.top - scrollInfo.yDifference,
          right: nodeRect.right - scrollInfo.xDifference,
          bottom: nodeRect.bottom - scrollInfo.yDifference,
          left: nodeRect.left - scrollInfo.xDifference,
        };

        this.setNodePosition(clippingMask, nodeRectAfterScroll);
      }
    }

    handleIntersectionEvent = (entries) => {
      if (this.intersectionObserverIsInitialized) {
        console.log('handle intersection event');
        const {
          rootBounds: clippingMask,
          boundingClientRect: nodeRect,
          isIntersecting: isVisible,
        } = entries[0];

        this.setNodePosition(clippingMask, nodeRect, isVisible);
      }

      this.intersectionObserverIsInitialized = true;
    }

    handleNodeResize = () => {
      console.log('handle node resize');
      this.setNodePosition(null, this.getNodeRect());
    }

    handleDocumentResize = () => {
      console.log('handle document resize');
      const nodeRect = this.getNodeRect();
      this.setNodePosition(null, nodeRect);
    }

    handleWindowResize = () => {
      const { windowInfo: { eventsFired } } = this.props;

      if (eventsFired > 1) {
        console.log('handle window resize');
        const clippingMask = this.getClippingMask();
        const nodeRect = this.getNodeRect();
        this.setNodePosition(clippingMask, nodeRect);
      }
    }

    getClippingMask = () => {
      console.log('get clipping mask');
      const { rootMargin } = this.options;
      const { windowInfo } = this.props;

      const margins = rootMargin.split(' ');
      const margin = {
        top: parseInt(margins[0], 10) || 0,
        right: parseInt(margins[1], 10) || 0,
        bottom: parseInt(margins[2], 10) || 0,
        left: parseInt(margins[3], 10) || 0,
      };

      return {
        width: windowInfo.width - margin.left - margin.right,
        height: windowInfo.height - margin.top - margin.bottom,
        top: margin.top,
        right: windowInfo.width + margin.left,
        bottom: windowInfo.height + margin.top,
        left: margin.left,
      };
    }

    getNodeRect = () => {
      console.log('get node rect');
      const { current: node } = this.nodeRef;
      const { width, height, top, right, bottom, left } = node.getBoundingClientRect();
      return { width, height, top, right, bottom, left };
    }

    calculateIntersection = (clippingMask, nodeRect, incomingVisibilityStatus) => {
      console.log('get intersection');
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
      console.log('get displacement');
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

    calculateTotalOffset = (nodeRect) => {
      console.log('get node offsets');
      const { scrollInfo } = this.props;
      return {
        totalOffsetLeft: scrollInfo.x + nodeRect.left,
        totalOffsetTop: scrollInfo.y + nodeRect.top,
      };
    }

    setNodePosition = (incomingClippingMask, incomingNodeRect, incomingVisibilityStatus) => {
      console.log('set node position');
      const { clippingMask, nodeRect } = this.state;

      this.setState({
        ...this.calculateIntersection(incomingClippingMask || clippingMask, incomingNodeRect || nodeRect, incomingVisibilityStatus),
        ...this.calculateDisplacement(incomingClippingMask || clippingMask, incomingNodeRect || nodeRect),
        ...this.calculateTotalOffset(incomingNodeRect || nodeRect),
      });
    }

    pruneStale = () => {
      const { isPruned } = this.state;

      if (!isPruned) {
        this.setState({
          ...this.initialState,
          isPruned: true,
        });
      }
    }

    render() {
      const passedProps = { ...this.props };
      delete passedProps.scrollInfo;
      delete passedProps.windowInfo;

      const passedState = { ...this.state };
      console.warn('render');

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
    windowInfo: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      eventsFired: PropTypes.number,
    }).isRequired,
    scrollInfo: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
      xDifference: PropTypes.number,
      yDifference: PropTypes.number,
      eventsFired: PropTypes.number,
    }).isRequired,
    documentInfo: PropTypes.shape({
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
