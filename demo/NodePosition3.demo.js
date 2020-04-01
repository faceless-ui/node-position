import React, { Fragment, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import withNodePosition from '../src/withNodePosition';
import PrintSummary from './PrintSummary';

const backgroundColor = 'violet';

const options = {
  rootMargin: '100px',
  reportScrollEvents: 'whenVisible',
  intersectionThreshold: [0, 0.25, 0.5, 0.75, 1],
};

const NodePositionDemo3 = forwardRef((props, ref) => {
  const { nodePosition, summaryContainer } = props;

  return (
    <Fragment>
      {summaryContainer.current && createPortal(
        <PrintSummary
          {...{
            summary: 'Node 3',
            color: backgroundColor,
            options,
            nodePosition,
          }}
        />,
        summaryContainer.current,
      )}
      <div
        ref={ref}
        style={{
          width: '110vw',
          height: '110vh',
          backgroundColor,
          display: 'inline-block',
        }}
      />
    </Fragment>
  );
});

NodePositionDemo3.propTypes = {
  nodePosition: PropTypes.shape({}).isRequired,
  summaryContainer: PropTypes.shape({
    current: PropTypes.shape({}),
  }).isRequired,
};

export default withNodePosition(
  NodePositionDemo3,
  options,
);
