import React, { Component, forwardRef } from 'react';
import { withNodePosition } from '../src'; // swap '../src' for '../dist/build.bundle' to demo production build

class WithNodePosition extends Component {
  render() {
    const { refToForward, nodePosition } = this.props;
    console.log('withNodePosition', nodePosition);
    return (
      <p ref={refToForward}>
        withNodePosition
      </p>
    );
  }
}

export default withNodePosition(
  forwardRef((props, ref) => (
    <WithNodePosition
      {...props}
      refToForward={ref}
    />
  )),
);
