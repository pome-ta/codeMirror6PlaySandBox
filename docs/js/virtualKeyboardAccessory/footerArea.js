import createBaseDom from './baseDom.js';

const createFooter = (idName = null, classNames = []) => {
  const element = createBaseDom('footer', idName, classNames);
  element.style.backgroundColor = `var(--backGround-color-scheme, light-dark(#f2f2f7, #1c1c1e))`;
  element.style.padding = '0.6rem 0';
  element.style.justifyContent = 'space-around';
  element.style.bottom = '0';

  return element;
};

export default createHeader;
