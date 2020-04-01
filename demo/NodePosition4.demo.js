import React, { Fragment, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import withNodePosition from '../src/withNodePosition';
import PrintSummary from './PrintSummary';

const options = {};

const backgroundColor = 'cyan';

const NodePositionDemo4 = forwardRef((props, ref) => {
  const { nodePosition, summaryContainer } = props;

  return (
    <Fragment>
      {summaryContainer.current && createPortal(
        <PrintSummary
          {...{
            summary: 'Node 4',
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
          width: '40rem',
          height: '500px',
          backgroundColor,
        }}
      />
    </Fragment>
  );
});

NodePositionDemo4.propTypes = {
  nodePosition: PropTypes.shape({}).isRequired,
  summaryContainer: PropTypes.shape({
    current: PropTypes.shape({}),
  }).isRequired,
};

export default withNodePosition(
  NodePositionDemo4,
  options,
);
