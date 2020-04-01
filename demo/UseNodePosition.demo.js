import React, { useRef, Fragment } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import { useNodePosition } from '../src'; // swap '../src' for '../dist/build.bundle' to demo production build
import PrintSummary from './PrintSummary';

const options = {};

const backgroundColor = 'lightcoral';

const UseNodePosition = (props) => {
  const ref = useRef();
  const nodePosition = useNodePosition(ref, options);

  const { summaryContainer } = props;

  console.log(summaryContainer);

  return (
    <Fragment>
      {summaryContainer && createPortal(
        <PrintSummary
          open
          {...{
            summary: 'UseNodePosition',
            color: backgroundColor,
            options,
            nodePosition,
          }}
        />,
        summaryContainer,
      )}
      <div
        ref={ref}
        style={{
          width: '40rem',
          height: '500px',
          marginLeft: '200px',
          background: backgroundColor,
        }}
      />
    </Fragment>
  );
};

UseNodePosition.defaultProps = {
  summaryContainer: null,
};

UseNodePosition.propTypes = {
  summaryContainer: PropTypes.shape({
    current: PropTypes.shape({}),
  }),
};

export default UseNodePosition;
