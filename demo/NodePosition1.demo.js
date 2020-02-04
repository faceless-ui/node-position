import React, { Fragment, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import withNodePosition from '../src/withNodePosition';
import NodeDetails from './NodeDetails';

const backgroundColor = 'lightcoral';

const NodePositionDemo1 = forwardRef((props, ref) => {
  const { nodePosition, detailsContainer } = props;

  return (
    <Fragment>
      {detailsContainer.current && createPortal(
        <NodeDetails
          summary="Node 1"
          nodePosition={nodePosition}
          color={backgroundColor}
          open
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

NodePositionDemo1.propTypes = {
  nodePosition: PropTypes.shape({}).isRequired,
  detailsContainer: PropTypes.shape({
    current: PropTypes.shape({}),
  }).isRequired,
};

export default withNodePosition(NodePositionDemo1, { trackOutOfFrame: true });
