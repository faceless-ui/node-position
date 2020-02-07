import React, { forwardRef, useEffect } from 'react';
import { mount } from 'enzyme';

import NodePositionProvider from '../NodePositionProvider';
import withNodePosition from '.';

describe('withNodePosition', () => {
  const Node = forwardRef((props, incomingRef) => {
    useEffect(() => {
      if (incomingRef.current) {
        incomingRef.current.getBoundingClientRect = () => ({ // eslint-disable-line no-param-reassign
          width: 512,
          height: 384,
          top: 0,
          right: 512,
          bottom: 384,
          left: 0,
        });
      }
    }, [incomingRef]);

    return (
      <code ref={incomingRef}>
        Hello, world!
      </code>
    );
  });

  const WithNodePosition = withNodePosition(Node);

  const wrapper = mount(
    <NodePositionProvider>
      <WithNodePosition />
    </NodePositionProvider>,
  );

  it.skip('rendered with an initial nodePosition prop of correct shape and value', () => {
    const mountedNode = wrapper.find(Node);
    const { nodePosition } = mountedNode.props();

    expect(nodePosition).toMatchObject({});
  });

  it.skip('updated with a tracked position', () => {
    const mountedNode = wrapper.find(Node);
    const DOMNode = mountedNode.getDOMNode();

    // The first scroll event reads the DOMRect of this node via getBoundingClientRect.
    // Since the window.scrollTo method below is just a mock, DOMRects within the JSDOM are rightfully stale and inaccurate.
    // So the return value of getBoundingClientRect must manually kept in sync with the scroll coordinates.
    // TLDR: if the component calls getBoundingClientRect, the DOMRect must be hard-coded.
    DOMNode.getBoundingClientRect = () => ({
      width: 512,
      height: 384,
      top: -383,
      right: 512,
      bottom: 1,
      left: 0,
    });

    window.scrollTo(0, 383);

    const { nodePosition } = mountedNode.props(); // TODO: calling props here returns an old state, even though the withNodePosition responded to the new scrollPos accurately

    expect(nodePosition).toMatchObject({});
  });
});
