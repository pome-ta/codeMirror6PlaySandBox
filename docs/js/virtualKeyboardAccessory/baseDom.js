import Dom from '../utils/dom.js';

const createBaseDom = (type, idName = null, classNames = []) => {
  const options = {
    setStyles: {
      position: 'sticky',
      width: '100%',
      'box-sizing': 'border-box',
    },
  };

  if (classNames.length > 0) {
    options.addClassList = classNames;
  }

  const element = Dom.create(type, options);
  if (idName !== null) {
    element.id = idName;
  }

  return element;
};

export default createBaseDom;
