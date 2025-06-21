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


import {AccessoryWidgets} from './virtualKeyboardAccessory/index.js';

const IS_TOUCH_DEVICE = window.matchMedia('(hover: none)').matches;



const buttonFactory = (buttonIconChar) => {
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
  
  const actionButton = createActionButton(buttonIconChar);
  return actionButton;

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
  const ele = buttonFactory(str);
  //footerDiv.appendChild(ele);
  return ele;
});

/*
leftButton.addEventListener('click', () => {
    cursorCharLeft(editor);
    editor.focus();
  });

leftButton.bind((this.addEventListener('click', () => {
    cursorCharLeft(editor);
    editor.focus();
  })))
*/

const hoge = () => {
  console.log('hoge')
}


hoge(null)

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
