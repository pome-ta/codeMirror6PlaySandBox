import createBaseDom from './baseDom.js';
import Dom from '../utils/dom.js';

const createHeader = (idName = null, classNames = []) => {
  return Dom.create(createBaseDom('header', idName, classNames), {
    setStyles: {
      'background-color': `var(--backGround-color-scheme, light-dark(#f2f2f7, #1c1c1e))`,
      'top': '0',
      'z-index': '1',
    },
  });
};

export default createHeader;
