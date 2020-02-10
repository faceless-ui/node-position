import React from 'react';
import PropTypes from 'prop-types';

const NodeDetails = (props) => {
  const {
    nodePosition: {
      clippingMask,
      nodeRect,
      intersectionRect,
      isVisible,
      xVisibility,
      yVisibility,
      visibility,
      xPlaneVisibility,
      yPlaneVisibility,
      isVisibleInPlaneX,
      isVisibleInPlaneY,
      xDisplacement,
      yDisplacement,
      displacement,
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
        {`reportScrollEvents: ${options.reportScrollEvents},`}
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
        {'clippingMask: {'}
        <br />
        &emsp;&emsp;
        {`width: ${clippingMask.width},`}
        <br />
        &emsp;&emsp;
        {`height: ${clippingMask.height},`}
        <br />
        &emsp;&emsp;
        {`top: ${clippingMask.top},`}
        <br />
        &emsp;&emsp;
        {`right: ${clippingMask.right},`}
        <br />
        &emsp;&emsp;
        {`bottom: ${clippingMask.bottom},`}
        <br />
        &emsp;&emsp;
        {`left: ${clippingMask.left},`}
        <br />
        &emsp;
        {'},'}
        <br />
        &emsp;
        {'nodeRect: {'}
        <br />
        &emsp;&emsp;
        {`width: ${nodeRect.width},`}
        <br />
        &emsp;&emsp;
        {`height: ${nodeRect.height},`}
        <br />
        &emsp;&emsp;
        {`top: ${nodeRect.top},`}
        <br />
        &emsp;&emsp;
        {`right: ${nodeRect.right},`}
        <br />
        &emsp;&emsp;
        {`bottom: ${nodeRect.bottom},`}
        <br />
        &emsp;&emsp;
        {`left: ${nodeRect.left},`}
        <br />
        &emsp;
        {'},'}
        <br />
        &emsp;
        {'intersectionRect: {'}
        <br />
        &emsp;&emsp;
        {`width: ${intersectionRect.width},`}
        <br />
        &emsp;&emsp;
        {`height: ${intersectionRect.height},`}
        <br />
        &emsp;
        {'},'}
        <br />
        &emsp;
        {`isVisible: ${isVisible},`}
        <br />
        &emsp;
        {`xVisibility: ${xVisibility},`}
        <br />
        &emsp;
        {`yVisibility: ${yVisibility},`}
        <br />
        &emsp;
        {`visibility: ${visibility},`}
        <br />
        &emsp;
        {`xPlaneVisibility: ${xPlaneVisibility},`}
        <br />
        &emsp;
        {`yPlaneVisibility: ${yPlaneVisibility},`}
        <br />
        &emsp;
        {`isVisibleInPlaneX: ${isVisibleInPlaneX},`}
        <br />
        &emsp;
        {`isVisibleInPlaneY: ${isVisibleInPlaneY},`}
        <br />
        &emsp;
        {`xDisplacement: ${xDisplacement},`}
        <br />
        &emsp;
        {`yDisplacement: ${yDisplacement},`}
        <br />
        &emsp;
        {`displacement: ${displacement},`}
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
    clippingMask: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),
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
    isVisible: PropTypes.bool,
    xVisibility: PropTypes.number,
    yVisibility: PropTypes.number,
    visibility: PropTypes.number,
    xPlaneVisibility: PropTypes.number,
    yPlaneVisibility: PropTypes.number,
    isVisibleInPlaneX: PropTypes.bool,
    isVisibleInPlaneY: PropTypes.bool,
    xDisplacement: PropTypes.number,
    yDisplacement: PropTypes.number,
    displacement: PropTypes.number,
    totalOffsetLeft: PropTypes.number,
    totalOffsetTop: PropTypes.number,
  }).isRequired,
  open: PropTypes.bool,
  summary: PropTypes.string,
  options: PropTypes.shape({
    reportScrollEvents: PropTypes.string,
    rootMargin: PropTypes.string,
    intersectionThreshold: PropTypes.array,
  }),
  color: PropTypes.string,
};

export default NodeDetails;
