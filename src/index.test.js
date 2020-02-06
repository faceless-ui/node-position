import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mockWindowResizeEvents, mockWindowScrollEvents, mockRequestAnimationFrame } from '@trbl/utils';

configure({ adapter: new Adapter() });

mockWindowScrollEvents({
  scrollArea: [1920, 4300],
});

mockWindowResizeEvents();
mockRequestAnimationFrame();
