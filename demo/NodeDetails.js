import React from 'react';
import PropTypes from 'prop-types';

const NodeDetails = (props) => {
  const {
    nodePosition: {
      nodeRect: {
        width,
        height,
        top,
        right,
        bottom,
        left,
      },
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
      displacementRatio,
      xDisplacementRatio,
      yDisplacementRatio,
      totalOffsetLeft,
      totalOffsetTop,
    },
    summary,
    open,
    options,
    color,
  } = props;

  return (
    <details open={open}>
      <summary style={{ color }}>
        <span style={{ color: 'black' }}>
          {summary}
        </span>
      </summary>
      <pre>
        {'options: {'}
        <br />
        &emsp;
        {`trackOutOfFrame: ${options.trackOutOfFrame},`}
        <br />
        &emsp;
        {`rootMargin: ${options.rootMargin},`}
        <br />
        &emsp;
        {`intersectionThreshold: ${options.intersectionThreshold},`}
        <br />
        {'}'}
      </pre>
      <pre>
        {'nodePosition: {'}
        <br />
        &emsp;
        {'nodeRect: {'}
        <br />
        &emsp;&emsp;
        {`width: ${width},`}
        <br />
        &emsp;&emsp;
        {`height: ${height},`}
        <br />
        &emsp;&emsp;
        {`top: ${top},`}
        <br />
        &emsp;&emsp;
        {`right: ${right},`}
        <br />
        &emsp;&emsp;
        {`bottom: ${bottom},`}
        <br />
        &emsp;&emsp;
        {`left: ${left},`}
        <br />
        &emsp;
        {'},'}
        <br />
        &emsp;
        {'intersectionRect: {'}
        <br />
        &emsp;&emsp;
        {`width: ${intersectionWidth},`}
        <br />
        &emsp;&emsp;
        {`height: ${intersectionHeight},`}
        <br />
        &emsp;
        {'},'}
        <br />
        &emsp;
        {`isIntersectingPlaneX: ${isIntersectingPlaneX},`}
        <br />
        &emsp;
        {`isIntersectingPlaneY: ${isIntersectingPlaneY},`}
        <br />
        &emsp;
        {`isIntersecting: ${isIntersecting},`}
        <br />
        &emsp;
        {`intersectionRatio: ${intersectionRatio},`}
        <br />
        &emsp;
        {`xIntersectionRatio: ${xIntersectionRatio},`}
        <br />
        &emsp;
        {`yIntersectionRatio: ${yIntersectionRatio},`}
        <br />
        &emsp;
        {`displacementRatio: ${displacementRatio},`}
        <br />
        &emsp;
        {`xDisplacementRatio: ${xDisplacementRatio},`}
        <br />
        &emsp;
        {`yDisplacementRatio: ${yDisplacementRatio},`}
        <br />
        &emsp;
        {`totalOffsetLeft: ${totalOffsetLeft},`}
        <br />
        &emsp;
        {`totalOffsetTop: ${totalOffsetTop},`}
        <br />
        {'}'}
      </pre>
    </details>
  );
};

NodeDetails.defaultProps = {
  open: false,
  summary: '',
  options: {},
  color: '',
};

NodeDetails.propTypes = {
  nodePosition: PropTypes.shape({
    nodeRect: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),
    intersectionRect: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
    }),
    isIntersectingPlaneX: PropTypes.bool,
    isIntersectingPlaneY: PropTypes.bool,
    isIntersecting: PropTypes.bool,
    intersectionRatio: PropTypes.number,
    xIntersectionRatio: PropTypes.number,
    yIntersectionRatio: PropTypes.number,
    displacementRatio: PropTypes.number,
    xDisplacementRatio: PropTypes.number,
    yDisplacementRatio: PropTypes.number,
    totalOffsetLeft: PropTypes.number,
    totalOffsetTop: PropTypes.number,
  }).isRequired,
  open: PropTypes.bool,
  summary: PropTypes.string,
  options: PropTypes.shape({
    trackOutOfFrame: PropTypes.bool,
    rootMargin: PropTypes.string,
    intersectionThreshold: PropTypes.array,
  }),
  color: PropTypes.string,
};

export default NodeDetails;
