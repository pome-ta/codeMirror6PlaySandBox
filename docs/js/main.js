import Dom from './utils/dom.js';
import createEditorView from './editor/index.js';
import {AccessoryWidgets} from './virtualKeyboardAccessory/index.js';

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


const buttonFactory = (buttonIconChar, actionHandle) => {
  function createFrame(width, height) {
    return Dom.create('div', {
      setStyles: {
        'min-width': `${width}`,
        'height': `${height}`,
        'display': 'flex',
        'justify-content': 'center',
        'align-items': 'center',
      },
    });
  }

  const btnW = '2.5rem';
  const btnRadius = '16%';

  const createActionButton = (iconChar) => {
    const button = Dom.create(createFrame('90%', '90%'), {
      setStyles: {
        'border-radius': `${btnRadius}`,
        'background-color': '#8e8e93', // light gray
        'filter': 'drop-shadow(2px 2px 2px rgba(28, 28, 30, 0.9))',
      },
    });
    
    const icon = Dom.create('span', {
      textContent: `${iconChar}`,
      setStyles: {
        'font-size': '1.0rem',
        'color': '#f2f2f7',
      },
    });
    
    button.appendChild(icon);

    const wrap = Dom.create(createFrame(btnW, '100%'), {
      setStyles: {
        'cursor': 'pointer',
      },
    });

    wrap.appendChild(button);
    return wrap;
  };

  const actionButton = createActionButton(buttonIconChar);
  actionButton.addEventListener('click', actionHandle);

  return actionButton;
};



/* --- load Source */
async function insertFetchDoc(filePath) {
  const fetchFilePath = async (path) => {
    const res = await fetch(path);
    return await res.text();
  };
  return await fetchFilePath(filePath);
}

// const codeFilePath = './js/editor/index.js';
const codeFilePath = './js/main.js';

const editorDiv = Dom.create('div', {
  setAttrs: {id: 'editor-div'},
  setStyles: {width: '100%'},
});
const editor = createEditorView(editorDiv);

/* --- accessory */
const buttons = Object.entries({
  '//': {
    targetEditor: editor,
    handleEvent: function () {
      toggleComment(this.targetEditor);
      this.targetEditor.focus();
    },
  },
  '▭': {
    targetEditor: editor,
    handleEvent: function () {
      selectLine(this.targetEditor);
      this.targetEditor.focus();
    },
  },
  '←': {
    targetEditor: editor,
    handleEvent: function () {
      cursorCharLeft(this.targetEditor);
      this.targetEditor.focus();
    },
  },
  '↓': {
    targetEditor: editor,
    handleEvent: function () {
      cursorLineDown(this.targetEditor);
      this.targetEditor.focus();
    },
  },
  '↑': {
    targetEditor: editor,
    handleEvent: function () {
      cursorLineUp(this.targetEditor);
      this.targetEditor.focus();
    },
  },
  '→': {
    targetEditor: editor,
    handleEvent: function () {
      cursorCharRight(this.targetEditor);
      this.targetEditor.focus();
    },
  },
  '⎁': {
    targetEditor: editor,
    handleEvent: function () {
      selectAll(this.targetEditor);
      this.targetEditor.focus();
    },
  },
  '⤻' :{
    targetEditor: editor,
    handleEvent: function () {
      redo(this.targetEditor);
      this.targetEditor.focus();
    },
  },
  '⤺': {
    targetEditor: editor,
    handleEvent: function () {
      undo(this.targetEditor);
      this.targetEditor.focus();
    },
  },

}).map(([str, fnc]) => {
  return buttonFactory(str, fnc, editor);
});

const h1Tag = Dom.create('h1', {
  textContent: 'Safari Virtual Keyboard Demo',
  setStyles: {'font-size': '1.5rem'},
});

const accessory = new AccessoryWidgets(IS_TOUCH_DEVICE);
accessory.setupHeader([h1Tag]);
accessory.setupFooter(buttons);

const setLayout = () => {
  const rootMain = Dom.create('div', {
    setAttrs: {'id': 'rootMain'},
    setStyles: {
      'display': 'grid',
      'grid-template-rows': 'auto 1fr auto',
      'height': '100%',
      'overflow': 'auto',
    },
  });

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
