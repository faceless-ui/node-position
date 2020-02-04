import React, { Fragment, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import withNodePosition from '../src/withNodePosition';
import NodeDetails from './NodeDetails';

const backgroundColor = 'violet';

const options = {
  rootMargin: '100px',
  trackOutOfFrame: true,
  intersectionThreshold: [0, 0.25, 0.5, 0.75, 1],
};

const NodePositionDemo3 = forwardRef((props, ref) => {
  const { nodePosition, detailsContainer } = props;

  return (
    <Fragment>
      {detailsContainer.current && createPortal(
        <NodeDetails
          summary="Node 3"
          options={options}
          nodePosition={nodePosition}
          color={backgroundColor}
          open
        />,
        detailsContainer.current,
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
  detailsContainer: PropTypes.shape({
    current: PropTypes.shape({}),
  }).isRequired,
};

export default withNodePosition(
  NodePositionDemo3,
  { ...options },
);
