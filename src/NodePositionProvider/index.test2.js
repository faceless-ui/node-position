import React from 'react';
import { mount } from 'enzyme';

import NodePositionProvider from '.';

describe('NodePositionProvider', () => {
  const wrapper = mount(
    <NodePositionProvider />,
  );

  it('rendered with an initial state of correct shape and value', () => {
    const state = wrapper.state();

    // expect(state).toMatchObject();
  });
});
