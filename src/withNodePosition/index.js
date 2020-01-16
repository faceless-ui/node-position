import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { withWindowInfo } from '@trbl/react-window-info';
import { withScrollInfo } from '@trbl/react-scroll-info';
import NodePositionContext from '../NodePositionProvider/context';

const withNodePosition = (PassedComponent) => {
  class Node extends Component {
    constructor(props) {
      super(props);

      this.nodeRef = createRef();

      this.state = {
        nodeRect: {
          width: 0,
          height: 0,
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
        },
        totalXOffset: 0,
        totalYOffset: 0,
        totalXTrack: 0,
        totalYTrack: 0,
        xDistanceToFrame: 0,
        yDistanceToFrame: 0,
        xIsInFrame: false,
        yIsInFrame: false,
        isInFrame: false,
        xPercentageInFrame: 0,
        yPercentageInFrame: 0,
        totalPercentageInFrame: 0,
      };
    }

    componentDidUpdate(prevProps) {
      const {
        scrollInfo: { eventsFired: scrollEvents },
        windowInfo: { eventsFired: windowEvents },
      } = this.props;

      const {
        scrollInfo: { eventsFired: prevScrollEvents },
        windowInfo: { eventsFired: prevWindowEvents },
      } = prevProps;

      if (windowEvents !== prevWindowEvents) {
        this.queryNodePosition();
      }

      if (scrollEvents !== prevScrollEvents) {
        // The getBoundingClientRect received on mount in Chrome is calculated relative to the cached scroll position (if present),
        // so tracking against it before the first scroll event would lead to desynchronization unless queryNodePosition
        // is run on the first scroll event, which allows for accurate, safe tracking on all subsequent events.
        if (scrollEvents <= 1) this.queryNodePosition();
        else this.trackNodePosition();
      }
    }

    interpretNodeRect = (nodeRect) => {
      const {
        scrollInfo: {
          x: scrollX,
          y: scrollY,
        },
        windowInfo: {
          width: windowWidth,
          height: windowHeight,
        },
      } = this.props;

      const { frameOffset } = this.context;

      const frame = {
        width: windowWidth - (frameOffset * 2),
        height: windowHeight - (frameOffset * 2),
        top: frameOffset,
        right: frameOffset ? windowWidth - frameOffset : windowWidth,
        bottom: frameOffset ? windowHeight - frameOffset : windowHeight,
        left: frameOffset,
      };

      const totalXOffset = scrollX + nodeRect.left;
      const totalYOffset = scrollY + nodeRect.top;

      const totalXTrack = frame.width + nodeRect.width;
      const xDistanceToFrame = nodeRect.right - frame.left; // note: the chosen variable name is not the most semantic (nodeRightToFrameLeftDistance || distanceToFrameXExit)
      const xPercentageInFrame = ((xDistanceToFrame / totalXTrack) * 100) || 0; // conditional assignment for cases where 0 / 0 === NaN

      const totalYTrack = frame.height + nodeRect.height;
      const yDistanceToFrame = nodeRect.bottom - frame.top; // note: the chosen variable name is not the most semantic (nodeBottomToFrameTopDistance || distanceToFrameYExit)
      const yPercentageInFrame = ((yDistanceToFrame / totalYTrack) * 100) || 0; // conditional assignment for cases where 0 / 0 === NaN

      const totalPercentageInFrame = (xPercentageInFrame + yPercentageInFrame) / 2;

      const xIsInFrame = nodeRect.right >= frame.left && nodeRect.left <= frame.right;
      const yIsInFrame = nodeRect.top <= frame.bottom && nodeRect.bottom >= frame.top;
      const isInFrame = xIsInFrame && yIsInFrame;

      return {
        totalXOffset,
        totalYOffset,
        totalXTrack,
        totalYTrack,
        xDistanceToFrame,
        yDistanceToFrame,
        xIsInFrame,
        yIsInFrame,
        xPercentageInFrame,
        yPercentageInFrame,
        totalPercentageInFrame,
        isInFrame,
      };
    }

    // true positions
    queryNodePosition = () => {
      const { current: node } = this.nodeRef;

      if (node) {
        const DOMRect = node.getBoundingClientRect(); // clientRect, relative to the vieport
        const { width, height, top, right, bottom, left } = DOMRect;
        const nodeRect = { width, height, top, right, bottom, left }; // create a new, plain object from the DOMRect object type

        const nodePosition = this.interpretNodeRect(nodeRect);

        this.setState({
          nodeRect,
          ...nodePosition,
        });
      }
    }

    // synthetic (calculated) positions
    trackNodePosition = () => {
      const {
        scrollInfo: {
          xDifference,
          yDifference,
        },
      } = this.props;

      const { nodeRect } = this.state;

      const newNodeRect = {
        ...nodeRect, // inherit width and height
        top: nodeRect.top - yDifference,
        right: nodeRect.right - xDifference,
        bottom: nodeRect.bottom - yDifference,
        left: nodeRect.left - xDifference,
      };

      const nodePosition = this.interpretNodeRect(newNodeRect);

      this.setState({
        nodeRect: newNodeRect,
        ...nodePosition,
      });
    }

    render() {
      const passedProps = { ...this.props };
      delete passedProps.windowInfo;
      delete passedProps.scrollInfo;

      return (
        <PassedComponent
          ref={this.nodeRef}
          nodePosition={{ ...this.state }}
          {...passedProps}
        />
      );
    }
  }

  Node.contextType = NodePositionContext;

  Node.defaultProps = {};

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
