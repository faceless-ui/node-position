import React, { Fragment, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import withNodePosition from '../src/withNodePosition';
import NodeDetails from './NodeDetails';

const options = {};

const backgroundColor = 'cyan';

const NodePositionDemo4 = forwardRef((props, ref) => {
  const { nodePosition, detailsContainer } = props;

  return (
    <Fragment>
      {detailsContainer.current && createPortal(
        <NodeDetails
          {...{
            summary: 'Node 4',
            color: backgroundColor,
            options,
            nodePosition,
          }}
        />,
        detailsContainer.current,
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
  detailsContainer: PropTypes.shape({
    current: PropTypes.shape({}),
  }).isRequired,
};

export default withNodePosition(
  NodePositionDemo4,
  options,
);
