//import Editor from './editor/index.js';
import createEditorView from './editor/index.js';


import {AccessoryWidgets} from './virtualKeyboardAccessory/index.js';

const IS_TOUCH_DEVICE = window.matchMedia('(hover: none)').matches;


const buttonFactory = (buttonIconChar) => {

  const createFrame = (width, height) => {
    const element = document.createElement('div');
    // wip: 最大数問題 調整してサイズ作る？
    element.style.minWidth = width;
    element.style.height = height;
    element.style.display = 'flex';
    element.style.justifyContent = 'center';
    element.style.alignItems = 'center';
    return element;
  };


  const createIcon = (char) => {
    const element = document.createElement('span');
    element.textContent = char;
    element.style.fontSize = '1.0rem';
    element.style.color = '#f2f2f7'; // gray6
    return element;
  };

  const btnW = '2.5rem';
  const btnRadius = '16%';


  const createActionButton = (iconChar) => {
    const button = createFrame('90%', '90%');
    button.style.borderRadius = btnRadius;
    button.style.backgroundColor = '#8e8e93'; // light gray
    button.style.filter = 'drop-shadow(2px 2px 2px rgba(28, 28, 30, 0.9))';

    const icon = createIcon(iconChar);
    button.appendChild(icon);


    const wrap = createFrame(btnW, '100%');
    wrap.style.cursor = 'pointer';
    wrap.appendChild(button);
    return wrap;
  };


  const actionButton = createActionButton(buttonIconChar);
  return actionButton;

};


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

// const editorDiv = createEditorDiv();
const editorDiv = (function () {
  this.id = 'editor-div';
  this.style.width = '100%';
  return this;
}).call(document.createElement('div'));


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
      changes: {from: editor.state?.doc.length, insert: loadedSource},
    });
  });

  accessory.eventHandler(editor);
});

