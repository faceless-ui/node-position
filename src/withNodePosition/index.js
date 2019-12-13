import React, { useState, useRef, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withWindowInfo } from '@trbl/react-window-info';
import { withScrollInfo } from '@trbl/react-scroll-info';
import NodePositionContext from '../NodePositionProvider/context';

const withNodePosition = (PassedComponent) => {
  const Node = (props) => {
    const { frameOffset } = useContext(NodePositionContext);

    const nodeRef = useRef(null);
    const [nodeRect, setNodeRect] = useState({
      width: 0,
      height: 0,
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    });

    const [totalXTrack, setTotalXTrack] = useState(0);
    const [totalYTrack, setTotalYTrack] = useState(0);

    const [xDistanceToFrame, setXDistanceToFrame] = useState(0);
    const [yDistanceToFrame, setYDistanceToFrame] = useState(0);
    const [xIsInFrame, setXIsInFrame] = useState(false);
    const [yIsInFrame, setYIsInFrame] = useState(false);
    const [isInFrame, setIsInFrame] = useState(false);

    const [xPercentageInFrame, setXPercentageInFrame] = useState(0);
    const [yPercentageInFrame, setYPercentageInFrame] = useState(0);
    const [totalPercentageInFrame, setTotalPercentageInFrame] = useState(0);

    const {
      windowInfo: {
        width: windowWidth,
        height: windowHeight,
        eventsFired: windowEvents,
      },
      scrollInfo: {
        eventsFired: scrollEvents,
        xDifference,
        yDifference,
      },
    } = props;

    useEffect(() => {
      if (scrollEvents <= 1) {
        const { current: node } = nodeRef;
        const DOMRect = node.getBoundingClientRect(); // clientRect, relative to the vieport
        const { width, height, top, right, bottom, left } = DOMRect;
        setNodeRect({ width, height, top, right, bottom, left }); // create a new, plain object from the DOMRect object type
      } else {
        // TODO: consider adjusting the newNodeRect to account for potential changes in the node dimensions.
        // i.e. if the node's width or height changed at any point during synthetic tracking, these tracked values become innacurate.
        // A performance hit for this feature is the necessary use of the clientWidth and clientHeight methods on every scroll.
        setNodeRect(currentRect => ({
          ...currentRect,
          top: currentRect.top - yDifference,
          right: currentRect.right - xDifference,
          bottom: currentRect.bottom - yDifference,
          left: currentRect.left - xDifference,
        }));
      }
    }, [scrollEvents, windowEvents, xDifference, yDifference]);

    useEffect(() => {
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

      setTotalXTrack(frame.width + nodeWidth);
      setTotalYTrack(frame.height + nodeHeight);
      setXDistanceToFrame(nodeRight - frame.left); // note: the chosen variable name is not the most semantic (nodeRightToFrameLeftDistance || distanceToFrameXExit;
      setYDistanceToFrame(nodeBottom - frame.top); // note: the chosen variable name is not the most semantic (nodeBottomToFrameTopDistance || distanceToFrameYExit;
      setXPercentageInFrame(((xDistanceToFrame / totalXTrack) * 100) || 0); // conditional assignment for cases where 0 / 0 === Na;
      setYPercentageInFrame(((yDistanceToFrame / totalYTrack) * 100) || 0); // conditional assignment for cases where 0 / 0 === Na;
      setTotalPercentageInFrame((xPercentageInFrame + yPercentageInFrame) / 2);
      setXIsInFrame(nodeRight >= frame.left && nodeLeft <= frame.right);
      setYIsInFrame(nodeTop <= frame.bottom && nodeBottom >= frame.top);
      setIsInFrame(xIsInFrame && yIsInFrame);
    }, [frameOffset, nodeRect, windowWidth, windowHeight, totalXTrack, totalYTrack, xDistanceToFrame, yDistanceToFrame, xPercentageInFrame, yPercentageInFrame, xIsInFrame, yIsInFrame]);

    return (
      <PassedComponent
        ref={nodeRef}
        nodePosition={{
          nodeRect,
          totalXTrack,
          totalYTrack,
          xDistanceToFrame,
          yDistanceToFrame,
          xIsInFrame,
          yIsInFrame,
          isInFrame,
          xPercentageInFrame,
          yPercentageInFrame,
          totalPercentageInFrame,
        }}
        {...props}
      />
    );
  };

  Node.propTypes = {
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

export default withNodePosition;
