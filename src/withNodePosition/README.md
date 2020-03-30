# withNodePosition

## Life Cycle

Node position is calculated when:
  - a scroll event was fired
  - an intersection event was fired (after initialization)
  - the document was resized (after initialization)
  - the node itself was resized (after initialization)

## Caveats

1. This component will currently only compare a node to the viewport (plus or minus the rootMargin)

2. This component **will not** accurately report the node position when it:

- is nested within any scroll container other than the document itself
- has been repositioned dynamically through some CSS property _or_ a DOM tree injection that doesn't...
  - cause the node itself to resize
  - _or_ cause the **document** to resize

Examples may include a change to the `flex-order` or a to-do-list-type-of component.
Fortunately, this cases can be mitigated by manually firing the `triggerRecalculation` method.
