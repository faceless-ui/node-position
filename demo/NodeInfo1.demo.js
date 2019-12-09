import React from 'react';
import PropTypes from 'prop-types';
import withNodeInfo from '../src/withNodeInfo';

const NodeInfoDemo1 = (props) => {
  const {
    nodeInfo: {
      nodeRect: {
        width,
        height,
        top,
        right,
        bottom,
        left,
      },
      xIsInFrame,
      yIsInFrame,
      xPercentageInFrame,
      yPercentageInFrame,
      totalPercentageInFrame,
      nodeIsInFrame,
    },
  } = props;

  return (
    <code
      style={{
        backgroundColor: 'rgba(0, 0, 0, .15)',
        display: 'inline-block',
      }}
    >
      <pre>
        {'nodeInfo: {'}
        <br />
        &emsp;
        {'nodeRect: {'}
        <br />
        &emsp;&emsp;
        {`width: ${width},`}
        <br />
        &emsp;&emsp;
        {`height: ${height},`}
        <br />
        &emsp;&emsp;
        {`top: ${top},`}
        <br />
        &emsp;&emsp;
        {`right: ${right},`}
        <br />
        &emsp;&emsp;
        {`bottom: ${bottom},`}
        <br />
        &emsp;&emsp;
        {`left: ${left},`}
        <br />
        &emsp;
        {'},'}
        <br />
        &emsp;
        {`xIsInFrame: ${xIsInFrame},`}
        <br />
        &emsp;
        {`yIsInFrame: ${yIsInFrame},`}
        <br />
        &emsp;
        {`xPercentageInFrame: ${xPercentageInFrame},`}
        <br />
        &emsp;
        {`yPercentageInFrame: ${yPercentageInFrame},`}
        <br />
        &emsp;
        {`totalPercentageInFrame: ${totalPercentageInFrame},`}
        <br />
        &emsp;
        {`nodeIsInFrame: ${nodeIsInFrame},`}
        <br />
        {'}'}
      </pre>
    </code>
  );
};

NodeInfoDemo1.defaultProps = {};

NodeInfoDemo1.propTypes = {
  nodeInfo: PropTypes.shape({
    nodeRect: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),
    xIsInFrame: PropTypes.bool,
    yIsInFrame: PropTypes.bool,
    xPercentageInFrame: PropTypes.number,
    yPercentageInFrame: PropTypes.number,
    totalPercentageInFrame: PropTypes.number,
    nodeIsInFrame: PropTypes.bool,
  }).isRequired,
};

export default withNodeInfo(NodeInfoDemo1);
