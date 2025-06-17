import Editor from './editor/index.js';

/* -- load Source */
async function insertSourceDoc(filePath) {
  const fetchFilePath = async (path) => {
    const res = await fetch(path);
    return await res.text();
  };
  return await fetchFilePath(filePath);
}

// --- main

function createRootDiv() {
  const element = document.createElement('div');
  element.id = 'root';
  element.style.cssText = `height: 100svh; width: 100%`;
  element.style.overflowY = 'scroll';

  return element;
}

function createEditorDiv() {
  const element = document.createElement('div');
  element.id = 'editor-div';
  element.style.cssText = `height: 100%; width: 100%; background-color: maroon`;

  return element;
}

// accessory
class Elementer {
  // header footer をいい感じに管理したい(Elementor じゃなくてもいいか、、)
  #element;

  constructor(type, idName = null, classNames = []) {
    this.#element = document.createElement(type);
    if (idName !== null) {
      this.#element.id = idName;
    }
    classNames.forEach((name) => {
      this.#element.classList.add(name);
    });
    this.addStyles();
  }

  get element() {
    return this.#element;
  }

  static of(type, idName, classNames) {
    const instance = new this(type, idName, classNames);
    return instance.element;
  }

  addStyles() {
    this.#element.style.position = 'sticky';
    this.#element.style.display = 'flex';
    this.#element.style.alignItems = 'center';
    this.#element.style.width = '100%';
  }
}

const createHeader = (idName = null, classNames = []) => {
  const element = Elementer.of('header', idName, classNames);
  element.style.top = '0';
  element.style.backgroundColor = 'maroon';
  element.style.zIndex = '1';

  return element;
};

const createFooter = (idName = null, classNames = []) => {
  const element = Elementer.of('footer', idName, classNames);
  element.style.padding = '0.6rem 0';
  element.style.justifyContent = 'space-around';
  element.style.backgroundColor = 'maroon';
  element.style.bottom = '0';

  return element;
};

class AccessoryWidgets {
  constructor(targetEditor, isMobile) {
    this.targetEditor = targetEditor;
    this.isMobile = isMobile;
    this.header = createHeader('header');
    this.footer = createFooter('footer');

    // if (this.isMobile) {
    //   this.footer = createFooter('footer');
    //   //this.footer.style.display = 'none';
    // }
  }

  #setupItems = (items, parent) =>
    items.forEach((item) => parent?.appendChild(item));

  setupHeader(items) {
    //this.#setupItems(items, this.header);
    items.forEach((item) => this.header.appendChild(item));
  }

  setupFooter(items) {
    // if (!this.isMobile) {
    //   return;
    // }
    //this.#setupItems(items, this.footer);
    items.forEach((item) => this.footer.appendChild(item));
  }

  // visualViewportHandler() {
  //   console.log(this.targetEditor.hasFocus);
  //   this.header.style.top = `${window.visualViewport.offsetTop}px`;

  //   //this.footer.style.display = targetEditor.hasFocus ? 'flex' : 'none';
  //   const upBottom =
  //     window.innerHeight -
  //     window.visualViewport.height +
  //     window.visualViewport.offsetTop -
  //     window.visualViewport.pageTop;

  //   console.log(`accessory: ${upBottom}`);
  //   console.log(`accessory: ${this.footer}`);

  //   this.footer.style.button = `${upBottom}px`;
  //   // this.footer.style.button = `${0}px`;
  // }

  eventtHandler() {
    const visualViewportHandler = () => {
      console.log(this.targetEditor.hasFocus);
      this.header.style.top = `${window.visualViewport.offsetTop}px`;

      //this.footer.style.display = targetEditor.hasFocus ? 'flex' : 'none';
      const upBottom =
        window.innerHeight -
        window.visualViewport.height +
        window.visualViewport.offsetTop -
        window.visualViewport.pageTop;

      console.log(`accessory: ${upBottom}`);
      console.log(`accessory: ${this.footer}`);

      this.footer.style.button = `${upBottom}px`;
      // this.footer.style.button = `${0}px`;
    };

    window.visualViewport.addEventListener('resize', visualViewportHandler);
    window.visualViewport.addEventListener('scroll', visualViewportHandler);
  }
}

const btnW = '2.5rem';
const btnRadius = '16%';

function _createButtonWrap(width, height) {
  const wrap = document.createElement('div');
  // xxx: 最大数問題
  wrap.style.minWidth = width;
  wrap.style.height = height;
  wrap.style.display = 'flex';
  wrap.style.justifyContent = 'center';
  wrap.style.alignItems = 'center';
  return wrap;
}

function createIcon(char) {
  const icon = document.createElement('span');
  icon.textContent = char;
  icon.style.fontSize = '1.0rem';
  icon.style.color = '#f2f2f7'; // gray6
  return icon;
}

function createActionButton(iconChar) {
  const wrap = _createButtonWrap(btnW, '100%');
  const button = _createButtonWrap('90%', '90%');
  const icon = createIcon(iconChar);
  wrap.appendChild(button);
  wrap.style.cursor = 'pointer';
  button.style.borderRadius = btnRadius;
  button.style.backgroundColor = '#8e8e93'; // light gray
  button.style.filter = 'drop-shadow(2px 2px 2px rgba(28, 28, 30, 0.9))';
  button.appendChild(icon);
  return wrap;
}

const h1Tag = document.createElement('h1');
h1Tag.style.fontSize = '1.5rem';
h1Tag.textContent = 'Safari Virtual Keyboard Demo';

const [
  commentButton,
  selectLineButton,
  leftButton,
  downButton,
  upButton,
  rightButton,
  selectAllButton,
  redoButton,
  undoButton,
  //reIndentButton,
] = ['//', '▭', '←', '↓', '↑', '→', '⎁', '⤻', '⤺'].map((str) => {
  const ele = createActionButton(str);
  //footerDiv.appendChild(ele);
  return ele;
});

const isMobile = (() => {
  const { userAgent, userAgentData } = window.navigator;
  // if (userAgentData === null) {
  //   return userAgent.match(/iPhone|Android.+Mobile/) !== null;
  // }
  // return userAgentData.mobile;
  return userAgentData === null
    ? userAgent.match(/iPhone|iPad|Android.+Mobile/) !== null
    : userAgentData.mobile;
})();

// console.log(isMobile);

// const codeFilePath = './js/editor/index.js';
const codeFilePath = './js/main.js';

const rootDiv = createRootDiv();
const editorDiv = createEditorDiv();
const editor = Editor.create(editorDiv);

const accessory = new AccessoryWidgets(editor, isMobile);
accessory.setupHeader([h1Tag]);
accessory.setupFooter([
  commentButton,
  selectLineButton,
  leftButton,
  downButton,
  upButton,
  rightButton,
  selectAllButton,
  redoButton,
  undoButton,
]);

document.addEventListener('DOMContentLoaded', () => {
  rootDiv.appendChild(accessory.header);
  rootDiv.appendChild(editorDiv);
  rootDiv.appendChild(accessory.footer);

  document.body.appendChild(rootDiv);
  accessory.eventtHandler();
  // window.visualViewport.addEventListener(
  //   'resize',
  //   accessory.visualViewportHandler
  // );
  // window.visualViewport.addEventListener(
  //   'scroll',
  //   accessory.visualViewportHandler
  // );
  insertSourceDoc(codeFilePath).then((loadedSource) => {
    // todo: 事前に`doc` が存在するなら、`doc` 以降にテキストを挿入
    editor.dispatch({
      changes: { from: editor.state.doc.length, insert: loadedSource },
    });
  });
  // accessory.eventtHandler();
});

// window.addEventListener('load', () => {
//   console.log(editor.hasFocus);
// });
