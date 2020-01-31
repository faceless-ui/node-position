import React, { forwardRef, Component } from 'react';
import PropTypes from 'prop-types';
import withNodePosition from '../src/withNodePosition';

class NodePositionDemo2 extends Component {
  render() {
    const {
      nodePosition: {
        nodeRect: {
          width,
          height,
          top,
          right,
          bottom,
          left,
        },
        totalXOffset,
        totalYOffset,
        totalXTrack,
        totalYTrack,
        xDistanceToFrame,
        yDistanceToFrame,
        xIsInFrame,
        yIsInFrame,
        isInFrame,
        xPercentageInFrame,
        yPercentageInFrame,
        totalPercentageInFrame,
      },
      refToForward,
    } = this.props;

    return (
      <code
        ref={refToForward}
        style={{
          backgroundColor: 'rgba(0, 0, 0, .15)',
          display: 'inline-block',
        }}
      >
        <pre>
          {'nodePosition: {'}
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
          {`totalXOffset: ${totalXOffset},`}
          <br />
          &emsp;
          {`totalYOffset: ${totalYOffset},`}
          <br />
          &emsp;
          {`totalXTrack: ${totalXTrack},`}
          <br />
          &emsp;
          {`totalYTrack: ${totalYTrack},`}
          <br />
          &emsp;
          {`xDistanceToFrame: ${xDistanceToFrame},`}
          <br />
          &emsp;
          {`yDistanceToFrame: ${yDistanceToFrame},`}
          <br />
          &emsp;
          {`xIsInFrame: ${xIsInFrame},`}
          <br />
          &emsp;
          {`yIsInFrame: ${yIsInFrame},`}
          <br />
          &emsp;
          {`isInFrame: ${isInFrame},`}
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
          {'}'}
        </pre>
      </code>
    );
  }
}

NodePositionDemo2.defaultProps = {};

NodePositionDemo2.propTypes = {
  nodePosition: PropTypes.shape({
    nodeRect: PropTypes.shape({
      width: PropTypes.number,
      height: PropTypes.number,
      top: PropTypes.number,
      right: PropTypes.number,
      bottom: PropTypes.number,
      left: PropTypes.number,
    }),
    totalXOffset: PropTypes.number,
    totalYOffset: PropTypes.number,
    totalXTrack: PropTypes.number,
    totalYTrack: PropTypes.number,
    xDistanceToFrame: PropTypes.number,
    yDistanceToFrame: PropTypes.number,
    xIsInFrame: PropTypes.bool,
    yIsInFrame: PropTypes.bool,
    isInFrame: PropTypes.bool,
    xPercentageInFrame: PropTypes.number,
    yPercentageInFrame: PropTypes.number,
    totalPercentageInFrame: PropTypes.number,
  }).isRequired,
  refToForward: PropTypes.shape({}).isRequired,
};

export default withNodePosition(
  forwardRef((props, ref) => (
    <NodePositionDemo2
      {...props}
      refToForward={ref}
    />
  )),
);
