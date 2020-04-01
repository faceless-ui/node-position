import React from 'react';
import PropTypes from 'prop-types';

const PrintSummary = (props) => {
  const {
    summary,
    color,
    open,
    nodePosition,
    options,
  } = props;

  return (
    <details open={open}>
      <summary style={{ color }}>
        <span style={{ color: 'black' }}>
          {summary}
        </span>
      </summary>
      <code>
        <pre style={{ margin: '0 0 20px' }}>
          {JSON.stringify({ options, nodePosition }, (k, v) => (v === undefined ? 'undefined' : v), 2)}
        </pre>
      </code>
    </details>
  );
};

PrintSummary.defaultProps = {
  open: false,
  summary: '',
  options: {},
  color: '',
};

PrintSummary.propTypes = {
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

export default PrintSummary;
