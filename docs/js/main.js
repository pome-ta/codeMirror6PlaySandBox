//import Editor from './editor/index.js';
import createEditorView from './editor/index.js';

import {
  undo,
  redo,
  selectAll,
  selectLine,
  indentSelection,
  cursorLineUp,
  cursorLineDown,
  cursorCharLeft,
  cursorCharRight,
  toggleComment,
} from './editor/codemirror/commands.js';

const IS_TOUCH_DEVICE = window.matchMedia('(hover: none)').matches;

class Elementer {
  // header footer をいい感じに管理したい(Elementor じゃなくてもいいか、、)
  #element;

  constructor(type, idName = null, classNames = []) {
    this.#element = document.createElement(type);
    if (idName !== null) {
      this.#element.id = idName;
    }
    classNames.forEach((name) => {
      this.#element.classList.add(name);
    });
    this.#element.style.cssText = `
      position: sticky;
      display: flex;
      align-items: center;
      width: 100%;
    `;
  }

  get element() {
    return this.#element;
  }

  static of(type, idName, classNames) {
    const instance = new this(type, idName, classNames);
    return instance.element;
  }
}

const createHeader = (idName = null, classNames = []) => {
  const element = Elementer.of('header', idName, classNames);
  element.style.top = '0';
  //element.style.backgroundColor = 'maroon';
  element.style.backgroundColor = `var(--backGround-color-scheme)`;
  element.style.zIndex = '1';

  return element;
};

const createFooter = (idName = null, classNames = []) => {
  const element = Elementer.of('footer', idName, classNames);
  element.style.padding = '0.6rem 0';
  element.style.justifyContent = 'space-around';
  //element.style.backgroundColor = 'maroon';
  element.style.backgroundColor = `var(--backGround-color-scheme)`;
  element.style.bottom = '0';

  return element;
};

class AccessoryWidgets {
  constructor(isTouchDevice) {
    this.isTouchDevice = isTouchDevice;
    this.header = createHeader('header');
    if (this.isTouchDevice) {
      this.footer = createFooter('footer');
      this.footer.style.display = 'none';
    }
    this.targetEditor = null;
  }

  #setupItems = (items, parent) =>
    items.forEach((item) => parent?.appendChild(item));

  setupHeader(items) {
    this.#setupItems(items, this.header);
  }

  setupFooter(items) {
    if (!this.isTouchDevice) {
      return;
    }
    this.#setupItems(items, this.footer);
  }

  eventHandler(targetEditor) {
    if (this.targetEditor === null) {
      this.targetEditor = targetEditor;
    }
    const visualViewportHandler = () => {
      const offsetTop = window.visualViewport.offsetTop;
      this.header.style.top = `${offsetTop}px`;

      if (this.isTouchDevice) {
        this.footer.style.display = this.targetEditor.hasFocus
          ? 'flex'
          : 'none';

        const offsetBottom =
          window.innerHeight -
          window.visualViewport.height +
          offsetTop -
          window.visualViewport.pageTop;
        this.footer.style.bottom = `${offsetBottom}px`;
      }
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


leftButton.addEventListener('click', () => {
    cursorCharLeft(editor);
    editor.focus();
  });


const buttons = [
  commentButton,
  selectLineButton,
  leftButton,
  downButton,
  upButton,
  rightButton,
  selectAllButton,
  redoButton,
  undoButton,
];

/* --- load Source */
async function insertFetchDoc(filePath) {
  const fetchFilePath = async (path) => {
    const res = await fetch(path);
    return await res.text();
  };
  return await fetchFilePath(filePath);
}

/* --- window-document */

function createEditorDiv() {
  const element = document.createElement('div');
  element.id = 'editor-div';
  element.style.width = '100%';
  //element.style.height = '100%';

  return element;
}

// const codeFilePath = './js/editor/index.js';
const codeFilePath = './js/main.js';

const editorDiv = createEditorDiv();
//const editor = Editor.create(editorDiv);
const editor = createEditorView(editorDiv);

/* --- accessory */
const h1Tag = document.createElement('h1');
h1Tag.style.fontSize = '1.5rem';
h1Tag.textContent = 'Safari Virtual Keyboard Demo';

const accessory = new AccessoryWidgets(IS_TOUCH_DEVICE);
accessory.setupHeader([h1Tag]);
accessory.setupFooter(buttons);

const setLayout = () => {
  const rootMain = document.createElement('main');
  rootMain.id = 'rootMain';
  rootMain.style.display = 'grid';
  rootMain.style.gridTemplateRows = 'auto 1fr auto';
  rootMain.style.height = '100%';

  rootMain.style.overflow = 'auto';

  rootMain.appendChild(accessory.header);
  rootMain.appendChild(editorDiv);
  if (IS_TOUCH_DEVICE) {
    rootMain.appendChild(accessory.footer);
  }
  document.body.appendChild(rootMain);
};

document.addEventListener('DOMContentLoaded', () => {
  setLayout();
  insertFetchDoc(codeFilePath).then((loadedSource) => {
    // todo: 事前に`doc` が存在するなら、`doc` 以降にテキストを挿入

    editor.dispatch({
      changes: { from: editor.state?.doc.length, insert: loadedSource },
    });
  });

  accessory.eventHandler(editor);
});

// window.addEventListener('load', () => {
//   // 別にここでなくてもいい
//   accessory.eventHandler(editor);
// });
