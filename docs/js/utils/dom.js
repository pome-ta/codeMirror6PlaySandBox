export default class Dom {
  #element;

  constructor(domTag) {
    this.#element =
      typeof domTag === 'string' ? document.createElement(domTag) : domTag;
  }

  get element() {
    return this.#element;
  }

  static create(tag, options) {
    const instance = new this(tag);
    if (options) {
      Object.entries(options).forEach(([key, value]) => instance[key](value));
    }

    return instance.element;
  }

  setAttr(name, val) {
    this.#element.setAttribute(name, val);
    return this;
  }

  setAttrs(attrs) {
    Object.entries(attrs).forEach(([key, value]) => this.setAttr(key, value));
    return this;
  }

  setStyle(prop, val) {
    this.#element.style.setProperty(prop, val);
    return this;
  }

  setStyles(styles) {
    Object.entries(styles).forEach(([key, value]) => this.setStyle(key, value));

    return this;
  }

  addClassList(nameList) {
    this.#element.classList.add(...nameList);
    return this;
  }

  textContent(value) {
    this.#element.textContent = value;
    return this;
  }

  addEventListener({ type, listener, options }) {
    this.#element.addEventListener(type, listener, options);
    return this;
  }

  targetAddEventListener({ target, type, listener, options }) {
    target.addEventListener(type, listener, options);

    return this;
  }

  targetAddEventListeners({ target, types, listener, options }) {
    [...types].forEach((type) => {
      this.targetAddEventListener({ target, type, listener, options });
    });

    return this;
  }

  appendChildren(children) {
    [...children].forEach((child) => {
      this.#element.appendChild(child);
    });
    return this;
  }

  appendParent(parent) {
    parent.appendChild(this.#element);
    return this;
  }
}
