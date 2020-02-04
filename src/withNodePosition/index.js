import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { withWindowInfo } from '@trbl/react-window-info';
import { withScrollInfo } from '@trbl/react-scroll-info';

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

      this.state = {
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
        xDisplacementRatio: 0,
        yDisplacementRatio: 0,
        displacementRatio: 0,
        totalOffsetLeft: 0,
        totalOffsetTop: 0,
      };
    }

    componentDidMount() {
      this.observer = new IntersectionObserver(this.handleIntersectionEvent, {
        root: this.options.root,
        rootMargin: this.options.rootMargin,
        threshold: this.options.intersectionThreshold,
      });

      this.observer.observe(this.nodeRef.current);
    }

    componentDidUpdate(prevProps) {
      const { scrollInfo, windowInfo } = this.props;
      const { isIntersecting } = this.state;

      if (this.options.trackOutOfFrame || isIntersecting) {
        if (windowInfo.eventsFired !== prevProps.windowInfo.eventsFired) this.handleWindowEvent();
        if (scrollInfo.eventsFired !== prevProps.scrollInfo.eventsFired) this.handleScrollEvent();
      }
    }

    handleWindowEvent = () => {
      this.queryNodePosition();
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
    handleIntersectionEvent = (entries) => { // executed on the main thread
      const {
        rootBounds: frameRect,
        boundingClientRect: nodeRect,
      } = entries[0];

      const intersectionInfo = this.getIntersectionInfo(frameRect, nodeRect);
      const displacementInfo = this.getDisplacementInfo(frameRect, nodeRect);
      const totalNodeOffsets = this.getTotalNodeOffsets(nodeRect);

      this.setState({
        frameRect,
        nodeRect,
        ...intersectionInfo,
        ...displacementInfo,
        ...totalNodeOffsets,
      });
    }

    // true position
    queryNodePosition = () => {
      const { windowInfo } = this.props;
      const { current: node } = this.nodeRef;

      if (node) {
        const frameOffset = 0;
        const frameRect = {
          width: windowInfo.width - (frameOffset * 2),
          height: windowInfo.height - (frameOffset * 2),
          top: frameOffset,
          right: frameOffset ? windowInfo.width - frameOffset : windowInfo.width,
          bottom: frameOffset ? windowInfo.height - frameOffset : windowInfo.height,
          left: frameOffset,
        };

        const nodeRect = node.getBoundingClientRect(); // clientRect, relative to the viewport
        const intersectionInfo = this.getIntersectionInfo(frameRect, nodeRect);
        const displacementInfo = this.getDisplacementInfo(frameRect, nodeRect);
        const totalNodeOffsets = this.getTotalNodeOffsets(nodeRect);

        this.setState({
          frameRect,
          nodeRect,
          ...intersectionInfo,
          ...displacementInfo,
          ...totalNodeOffsets,
        });
      }
    }

    // synthetic (calculated) position
    trackNodePosition = () => {
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

      const intersectionInfo = this.getIntersectionInfo(frameRect, trackedNodeRect);
      const displacementInfo = this.getDisplacementInfo(frameRect, nodeRect);

      this.setState({
        nodeRect: trackedNodeRect,
        ...intersectionInfo,
        ...displacementInfo,
      });
    }

    getIntersectionInfo = (frameRect, nodeRect) => {
      const isContainedInPlaneX = nodeRect.right > frameRect.left && nodeRect.right < frameRect.right;
      const isContainedInPlaneY = nodeRect.bottom > frameRect.top && nodeRect.bottom < frameRect.bottom;

      // TODO: Revisit the width calculation to improve concision and semantics
      let intersectionWidth = 0;
      if (isContainedInPlaneX) {
        if (nodeRect.left >= frameRect.left) intersectionWidth = nodeRect.right - nodeRect.left;
        else intersectionWidth = nodeRect.right;
      } else if (nodeRect.right > frameRect.right && nodeRect.left < frameRect.right) {
        if (nodeRect.left <= frameRect.right) intersectionWidth = frameRect.right - nodeRect.left;
        else intersectionWidth = frameRect.right;
      }

      // TODO: Revisit the height calculation to improve concision and semantics
      let intersectionHeight = 0;
      if (isContainedInPlaneY) {
        if (nodeRect.top >= frameRect.top) intersectionHeight = nodeRect.bottom - nodeRect.top;
        else intersectionHeight = nodeRect.bottom;
      } else if (nodeRect.bottom > frameRect.bottom && nodeRect.top < frameRect.bottom) {
        if (nodeRect.top <= frameRect.bottom) intersectionHeight = frameRect.bottom - nodeRect.top;
        else intersectionHeight = frameRect.bottom;
      }

      const isIntersectingPlaneX = intersectionWidth > 0;
      const isIntersectingPlaneY = intersectionHeight > 0;
      const isIntersecting = isIntersectingPlaneX && isIntersectingPlaneY;

      intersectionWidth = isIntersecting ? intersectionWidth : 0;
      intersectionHeight = isIntersecting ? intersectionHeight : 0;
      const xIntersectionRatio = isIntersecting ? intersectionWidth / nodeRect.width : 0;
      const yIntersectionRatio = isIntersecting ? intersectionHeight / nodeRect.height : 0;
      const intersectionRatio = (xIntersectionRatio + yIntersectionRatio) / 2;

      return {
        // TODO: Add top, right, bottom, and left to intersectionRect object
        intersectionRect: {
          width: intersectionWidth,
          height: intersectionHeight,
        },
        isIntersectingPlaneX,
        isIntersectingPlaneY,
        isIntersecting,
        intersectionRatio,
        xIntersectionRatio,
        yIntersectionRatio,
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

    render() {
      const passedState = { ...this.state };

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

  return withWindowInfo(withScrollInfo(Node));
};

export default withNodePosition;
