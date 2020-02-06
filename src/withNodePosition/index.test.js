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

  it('rendered with an initial nodePosition prop of correct shape and value', () => {
    const mountedNode = wrapper.find(Node);
    const { nodePosition } = mountedNode.props();

    expect(nodePosition).toMatchObject({
      nodeRect: {
        width: 512,
        height: 384,
        top: 0,
        right: 512,
        bottom: 384,
        left: 0,
      },
      intersectionRect: {
        width: 512,
        height: 384,
      },
      isIntersectingPlaneX: true,
      isIntersectingPlaneY: true,
      isIntersecting: true,
      intersectionRatio: 1,
      xIntersectionRatio: 1,
      yIntersectionRatio: 1,
      xPlaneIntersectionRatio: 1,
      yPlaneIntersectionRatio: 1,
      xDisplacementRatio: 0.3333333333333333,
      yDisplacementRatio: 0.3333333333333333,
      displacementRatio: 0.3333333333333333,
      totalOffsetLeft: 0,
      totalOffsetTop: 0,
      frameRect: {
        width: 1024,
        height: 768,
        top: 0,
        right: 1024,
        bottom: 768,
        left: 0,
      },
    });
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
