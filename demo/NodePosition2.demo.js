import React, { forwardRef, Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import withNodePosition from '../src/withNodePosition';
import NodeDetails from './NodeDetails';

const options = {
  reportScrollEvents: 'always',
};

const backgroundColor = 'aquamarine';

class NodePositionDemo2 extends Component {
  render() {
    const {
      nodePosition,
      refToForward,
      detailsContainer,
    } = this.props;

    return (
      <Fragment>
        {detailsContainer.current && createPortal(
          <NodeDetails
            {...{
              summary: 'Node 2',
              color: backgroundColor,
              options,
              nodePosition,
            }}
          />,
          detailsContainer.current,
        )}
        <div
          ref={refToForward}
          style={{
            width: '110vw',
            height: '33vh',
            backgroundColor,
            display: 'inline-block',
          }}
        />
      </Fragment>
    );
  }
}

NodePositionDemo2.propTypes = {
  nodePosition: PropTypes.shape({}).isRequired,
  refToForward: PropTypes.shape({}).isRequired,
  detailsContainer: PropTypes.shape({
    current: PropTypes.shape({}),
  }).isRequired,
};

export default withNodePosition(
  forwardRef((props, ref) => (
    <NodePositionDemo2
      {...props}
      refToForward={ref}
    />
  )),
  options,
);

// shouldComponentUpdate(nextProps) {
//   const nodePositionDidNotChange = isEqual(this.props.nodePosition, nextProps.nodePosition);
//   return !nodePositionDidNotChange;
//   { reportScrollEvents: 'never' },
// }
