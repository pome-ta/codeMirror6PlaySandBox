import createBaseDom from './baseDom.js';
import Dom from '../utils/dom.js';

const createFooter = (idName = null, classNames = []) => {
  return Dom.create(createBaseDom('footer', idName, classNames), {
    setStyles: {
      'background-color': `var(--backGround-color-scheme, light-dark(#f2f2f7, #1c1c1e))`,
      'padding': '0.6rem 0',
      'justify-content': 'space-around',
      //'justify-content': 'space-between',
      'bottom': '0',
    },
  });
};



export default createFooter;
