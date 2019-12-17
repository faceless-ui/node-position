import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import withNodePositionContext from '../withNodePositionContext';

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

    componentDidMount() {
      this.queryNodePosition();
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
        frameOffset,
        scrollInfo: {
          x: scrollX,
          y: scrollY,
        },
        windowInfo: {
          width: windowWidth,
          height: windowHeight,
        },
      } = this.props;

      const {
        width: nodeWidth,
        height: nodeHeight,
        top: nodeTop,
        right: nodeRight,
        bottom: nodeBottom,
        left: nodeLeft,
      } = nodeRect;

      const frame = {
        width: windowWidth - (frameOffset * 2),
        height: windowHeight - (frameOffset * 2),
        top: frameOffset,
        right: frameOffset ? windowWidth - frameOffset : windowWidth,
        bottom: frameOffset ? windowHeight - frameOffset : windowHeight,
        left: frameOffset,
      };

      const totalXOffset = scrollX + nodeLeft;
      const totalYOffset = scrollY + nodeTop;

      const totalXTrack = frame.width + nodeWidth;
      const xDistanceToFrame = nodeRight - frame.left; // note: the chosen variable name is not the most semantic (nodeRightToFrameLeftDistance || distanceToFrameXExit)
      const xPercentageInFrame = ((xDistanceToFrame / totalXTrack) * 100) || 0; // conditional assignment for cases where 0 / 0 === NaN

      const totalYTrack = frame.height + nodeHeight;
      const yDistanceToFrame = nodeBottom - frame.top; // note: the chosen variable name is not the most semantic (nodeBottomToFrameTopDistance || distanceToFrameYExit)
      const yPercentageInFrame = ((yDistanceToFrame / totalYTrack) * 100) || 0; // conditional assignment for cases where 0 / 0 === NaN

      const totalPercentageInFrame = (xPercentageInFrame + yPercentageInFrame) / 2;

      const xIsInFrame = nodeRight >= frame.left && nodeLeft <= frame.right;
      const yIsInFrame = nodeTop <= frame.bottom && nodeBottom >= frame.top;
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

      // TODO: consider adjusting the newNodeRect to account for potential changes in the node dimensions.
      // i.e. if the node's width or height changed at any point during synthetic tracking, these tracked values become innacurate.
      // A performance hit for this feature is the necessary use of the clientWidth and clientHeight methods on every scroll.
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

  Node.propTypes = {
    frameOffset: PropTypes.number.isRequired,
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

  return withNodePositionContext(Node);
};

export default withNodePosition;
