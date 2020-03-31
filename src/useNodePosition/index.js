import { useEffect, useState, useContext, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { useWindowInfo } from '@trbl/react-window-info';
import { useScrollInfo } from '@trbl/react-scroll-info';
import NodePositionContext from '../NodePositionProvider/context';

const defaultOptions = {};

const initialNodePosition = {
  clippingMask: {
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
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
  totalOffsetLeft: 0,
  totalOffsetTop: 0,
};

const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => { ref.current = value; });
  return ref.current;
};

const calculateIntersection = (clippingMask, nodeRect, incomingVisibilityStatus) => {
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
};

const calculateDisplacement = (clippingMask, nodeRect) => {
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
};

const calculateTotalOffset = () => ({
  totalOffsetLeft: 0,
  totalOffsetTop: 0,
});

const getNodeRect = (nodeRef) => {
  const { current: node } = nodeRef;
  const { width, height, top, right, bottom, left } = node.getBoundingClientRect();
  return { width, height, top, right, bottom, left };
};

const nodePositionReducer = (state, payload) => {
  const {
    clippingMask: incomingClippingMask,
    nodeRect: incomingNodeRect,
  } = payload;

  const clippingMask = incomingClippingMask || state.clippingMask;
  const nodeRect = incomingNodeRect || state.nodeRect;

  return {
    clippingMask,
    nodeRect,
    ...calculateIntersection(clippingMask, nodeRect),
    ...calculateDisplacement(clippingMask, nodeRect),
    ...calculateTotalOffset(nodeRect),
  };
};

const useNodePosition = (nodeRef, incomingOptions) => {
  const { documentInfo } = useContext(NodePositionContext);
  const [nodePosition, dispatchNodePosition] = useReducer(nodePositionReducer, initialNodePosition);

  //
  // Merge options with defaults into state
  //

  const [options, setOptions] = useState(defaultOptions);

  useEffect(() => {
    setOptions({
      ...defaultOptions,
      ...incomingOptions,
    });
  }, [incomingOptions]);

  //
  // Handling incoming node ref
  //

  useEffect(() => {
    dispatchNodePosition({ type: 'REF', payload: nodeRef });
  }, [nodeRef]);

  //
  // Handle window resize events
  //

  const windowInfo = useWindowInfo();
  const prevWindowEventsFired = usePrevious(windowInfo.eventsFired);

  useEffect(() => {
    if (windowInfo.eventsFired > prevWindowEventsFired) {
      console.log('WINDOW_EVENT');
      dispatchNodePosition({
        clippingMask: {
          width: windowInfo.width,
          height: windowInfo.height,
          top: 0,
          right: windowInfo.width,
          bottom: windowInfo.height,
          left: 0,
        },
        nodeRect: {
          ...getNodeRect(nodeRef),
        },
      });
    }
  }, [windowInfo, options, prevWindowEventsFired, nodeRef]);

  //
  // Handle scroll events
  //

  const scrollInfo = useScrollInfo();
  const prevScrollEventsFired = usePrevious(scrollInfo.eventsFired);

  useEffect(() => {
    if (
      scrollInfo.eventsFired > prevScrollEventsFired
      && (!documentInfo.canUseIntersectionObserver
        || options.reportScrollEvents === 'always'
        || (!options.isVisible && options.reportScrollEvents === 'whenInvisible')
        || (options.isVisible && options.reportScrollEvents === 'whenVisible'))
    ) {
      console.log('SCROLL_EVENT');
      console.log('current', scrollInfo.eventsFired);
      console.log('prev', prevScrollEventsFired);
      const { nodeRect } = nodePosition;
      dispatchNodePosition({
        nodeRect: {
          width: nodeRect.width,
          height: nodeRect.height,
          top: nodeRect.top - scrollInfo.yDifference,
          right: nodeRect.right - scrollInfo.xDifference,
          bottom: nodeRect.bottom - scrollInfo.yDifference,
          left: nodeRect.left - scrollInfo.xDifference,
        },
      });
    }
  }, [scrollInfo, documentInfo, options, prevScrollEventsFired, nodePosition]);

  //
  // Return the nodePosition
  //

  return nodePosition;
};

useNodePosition.defaultProps = {
  ref: undefined,
};

useNodePosition.propTypes = {
  ref: PropTypes.func,
};

export default useNodePosition;
