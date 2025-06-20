import createBaseDom from './baseDom.js';

const createHeader = (idName = null, classNames = []) => {
  const element = createBaseDom('header', idName, classNames);
  element.style.backgroundColor = `var(--backGround-color-scheme, light-dark(#f2f2f7, #1c1c1e))`;
  element.style.top = '0';
  element.style.zIndex = '1';

  return element;
};


export default createHeader;

