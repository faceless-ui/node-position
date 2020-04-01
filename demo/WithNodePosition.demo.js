import React, { Fragment, Component, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { withNodePosition } from '../src'; // swap '../src' for '../dist/build.bundle' to demo production build
import PrintSummary from './PrintSummary';

const options = {};

const backgroundColor = 'cyan';

class WithNodePosition extends Component {
  render() {
    const { refToForward, nodePosition, summaryContainer } = this.props;

    console.log('withNodePosition', nodePosition);

    return (
      <Fragment>
        {summaryContainer && createPortal(
          <PrintSummary
            open
            {...{
              summary: 'WithNodePosition',
              color: backgroundColor,
              options,
              nodePosition,
            }}
          />,
          summaryContainer,
        )}
        <div
          ref={refToForward}
          style={{
            width: '40rem',
            height: '500px',
            marginLeft: '200px',
            background: backgroundColor,
          }}
        />
      </Fragment>
    );
  }
}

WithNodePosition.defaultProps = {
  summaryContainer: null,
};

WithNodePosition.propTypes = {
  refToForward: PropTypes.shape({}).isRequired,
  nodePosition: PropTypes.shape({}).isRequired,
  summaryContainer: PropTypes.shape({
    current: PropTypes.shape({}),
  }),
};

export default withNodePosition(
  forwardRef((props, ref) => (
    <WithNodePosition
      {...props}
      refToForward={ref}
    />
  )), options,
);
