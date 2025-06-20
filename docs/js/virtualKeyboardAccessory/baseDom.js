const createBaseDom = (type, idName = null, classNames = []) => {
  const element = document.createElement(type);
  if (idName !== null) {
    element.id = idName;
  }
  classNames.forEach((name) => {
    element.classList.add(name);
  });
  element.style.cssText = `
    position: sticky;
    display: flex;
    align-items: center;
    width: 100%;
  `;

  return element;
};

export default createBaseDom;
