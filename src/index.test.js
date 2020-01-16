import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

window.resizeTo = function resizeTo(width, height) {
  Object.assign(this, {
    innerWidth: width,
    innerHeight: height,
    outerWidth: width,
    outerHeight: height,
  }).dispatchEvent(new this.Event('resize'));
};

window.scrollTo = function scrollTo(xCoord, yCoord) {
  Object.assign(this, {
    pageXOffset: xCoord,
    pageYOffset: yCoord,
  }).dispatchEvent(new this.Event('scroll'));
};

window.requestAnimationFrame = (callback) => {
  const timestamp = performance.now();
  callback(timestamp);
};

const addSettersToBody = (properties) => {
  if (properties && properties.length > 0) {
    properties.forEach((property) => {
      Object.defineProperty(window.document.body, property, {
        writable: true,
        set property(value) {
          this[property] = value;
        },
      });
    });
  }
};

addSettersToBody(['scrollWidth', 'scrollHeight']);

window.document.body.scrollWidth = 2483;
window.document.body.scrollHeight = 5000;
