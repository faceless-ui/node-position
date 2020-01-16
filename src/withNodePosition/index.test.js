import React, { forwardRef } from 'react';
import { shallow, mount } from 'enzyme';

import NodePositionProvider from '../NodePositionProvider';
import withNodePosition from '.';

describe('withNodePosition', () => {
  const PrintProps = () => 'Hello, world!';

  const WithNodePosition = withNodePosition(forwardRef((props, ref) => (
    <code ref={ref}>
      <PrintProps {...props} />
    </code>
  )));

  // Note: when .props() is called on a shallow wrapper, the returned values will be
  // of the root node that the wrapper component renders — not the component itself.
  // See https://airbnb.io/enzyme/docs/api/ShallowWrapper/props.html
  const wrapper = mount(
    <NodePositionProvider>
      <WithNodePosition />
    </NodePositionProvider>,
  );

  it('rendered with an initial windowInfo prop of correct shape and value', () => {
    // const { value: { nodePosition } } = wrapper.props();
    window.scrollTo(0, 200);
    console.log(wrapper.find(PrintProps).props());

    // expect(nodePosition).toMatchObject();
  });
});
