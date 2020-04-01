import React, { forwardRef, Component, Fragment } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import withNodePosition from '../src/withNodePosition';
import PrintSummary from './PrintSummary';

const options = {
  reportScrollEvents: 'always',
};

const backgroundColor = 'aquamarine';

class NodePositionDemo2 extends Component {
  render() {
    const {
      nodePosition,
      refToForward,
      summaryContainer,
    } = this.props;

    return (
      <Fragment>
        {summaryContainer.current && createPortal(
          <PrintSummary
            {...{
              summary: 'Node 2',
              color: backgroundColor,
              options,
              nodePosition,
            }}
          />,
          summaryContainer.current,
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
  summaryContainer: PropTypes.shape({
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
