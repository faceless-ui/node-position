import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { withWindowInfo } from '@trbl/react-window-info';
import { withScrollInfo } from '@trbl/react-scroll-info';

const withNodeInfo = (PassedComponent) => {
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
        xIsInFrame: false,
        yIsInFrame: false,
        xPercentageInFrame: 0,
        yPercentageInFrame: 0,
        totalPercentageInFrame: 0,
        nodeIsInFrame: false,
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
        if (scrollEvents > 1) {
          this.trackNodePosition();
        } else {
          this.queryNodePosition();
        }
      }
    }

    calculateFrameInfo = (nodeRect) => {
      const {
        threshold,
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
        width: windowWidth - (threshold * 2),
        height: windowHeight - (threshold * 2),
        top: threshold,
        right: threshold ? windowWidth - threshold : windowWidth,
        bottom: threshold ? windowHeight - threshold : windowHeight,
        left: threshold,
      };

      const totalYTravel = frame.height + nodeHeight;
      const yDistanceToBoundary = nodeTop + nodeHeight;
      const yPercentageInFrame = Number((1 - (yDistanceToBoundary / totalYTravel)).toFixed(3));
      const yIsInFrame = nodeTop <= frame.bottom && nodeBottom >= frame.top;

      const totalXTravel = frame.width + nodeWidth;
      const xDistanceToBoundary = nodeLeft + nodeWidth;
      const xPercentageInFrame = Number((1 - (xDistanceToBoundary / totalXTravel)).toFixed(3));
      const xIsInFrame = nodeRight >= frame.left && nodeLeft <= frame.right;

      const totalPercentageInFrame = Number(((xPercentageInFrame + yPercentageInFrame) / 2).toFixed(3));
      const nodeIsInFrame = totalPercentageInFrame >= 0 && totalPercentageInFrame <= 1;

      return {
        xIsInFrame,
        yIsInFrame,
        xPercentageInFrame,
        yPercentageInFrame,
        totalPercentageInFrame,
        nodeIsInFrame,
      };
    }

    // true positions
    queryNodePosition = () => {
      const {
        current: node,
      } = this.nodeRef;

      if (node) {
        const DOMRect = node.getBoundingClientRect(); // clientRect because its relative to the vieport
        const { width, height, top, right, bottom, left } = DOMRect;
        const nodeRect = { width, height, top, right, bottom, left }; // create a new, plain object from the DOMRect object

        const frameInfo = this.calculateFrameInfo(nodeRect);

        this.setState({
          nodeRect,
          ...frameInfo,
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

      const {
        nodeRect,
      } = this.state;

      const newNodeRect = {
        ...nodeRect, // inherit width and height
        top: nodeRect.top - yDifference,
        right: nodeRect.right - xDifference,
        bottom: nodeRect.bottom - yDifference,
        left: nodeRect.left - xDifference,
      };

      const frameInfo = this.calculateFrameInfo(newNodeRect);

      this.setState({
        nodeRect: newNodeRect,
        ...frameInfo,
      });
    }

    render() {
      const {
        nodeRect,
        xIsInFrame,
        yIsInFrame,
        xPercentageInFrame,
        yPercentageInFrame,
        totalPercentageInFrame,
        nodeIsInFrame,
      } = this.state;

      const passedProps = { ...this.props };
      delete passedProps.windowInfo;
      delete passedProps.scrollInfo;
      delete passedProps.threshold;

      return (
        <PassedComponent
          ref={this.nodeRef}
          nodeInfo={{
            nodeRect,
            xIsInFrame,
            yIsInFrame,
            xPercentageInFrame,
            yPercentageInFrame,
            totalPercentageInFrame,
            nodeIsInFrame,
          }}
          {...passedProps}
        />
      );
    }
  }

  Node.defaultProps = {
    threshold: 0,
  };

  Node.propTypes = {
    threshold: PropTypes.number,
    scrollInfo: PropTypes.shape({
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

export default withNodeInfo;
