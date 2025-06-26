import createHeader from './headerArea.js';
import createFooter from './footerArea.js';

class AccessoryWidgets {
  #header;
  #footer;

  constructor(isTouchDevice, header = null, footer = null) {
    this.isTouchDevice = isTouchDevice;
    this.#header = header === null ? createHeader('header') : header;

    if (this.isTouchDevice) {
      this.#footer = footer === null ? createFooter('footer') : footer;
      this.#footer.style.display = 'none';
    }
    this.targetEditor = null;
  }

  get header() {
    return this.#header;
  }

  get footer() {
    return this.#footer;
  }

  #setupItems = (items, parent) =>
    items.forEach((item) => parent?.appendChild(item));

  setupHeader(items) {
    this.#setupItems(items, this.#header);
  }

  setupFooter(items) {
    if (!this.isTouchDevice) {
      return;
    }
    this.#setupItems(items, this.#footer);
  }

  eventHandler(targetEditor) {
    if (this.targetEditor === null) {
      this.targetEditor = targetEditor;
    }
    const visualViewportHandler = () => {
      const offsetTop = window.visualViewport.offsetTop;
      this.#header.style.top = `${offsetTop}px`;

      if (this.isTouchDevice) {
        this.#footer.style.display = this.targetEditor.hasFocus
          ? 'flex'
          : 'none';

        const offsetBottom =
          window.innerHeight -
          window.visualViewport.height +
          offsetTop -
          window.visualViewport.pageTop;
        this.#footer.style.bottom = `${offsetBottom}px`;
      }
    };
    window.visualViewport.addEventListener('resize', visualViewportHandler);
    window.visualViewport.addEventListener('scroll', visualViewportHandler);
  }
}

export { AccessoryWidgets };
