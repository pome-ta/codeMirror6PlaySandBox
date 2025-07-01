import Dom from './utils/dom.js';
import createEditorView from './editor/index.js';

import {EditorSelection} from './editor/codemirror/state.js';
import {
  cursorCharLeft,
  cursorCharRight,
  cursorLineDown,
  cursorLineUp,
  redo,
  selectAll,
  selectLine,
  toggleComment,
  undo,
} from './editor/codemirror/commands.js';


const IS_TOUCH_DEVICE = window.matchMedia('(hover: none)').matches;

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
  setAttrs: {
    id: 'editor-div',
  },
  setStyles: {
    width: '100%',
  },
});
const editor = createEditorView(editorDiv);


/* --- accessory */
const hideButtonHandleEvent = function (e) {
  const divStyle = this.targetDiv.style;
  if (divStyle.display === 'none') {
    divStyle.display = '';
    e.target.textContent = '🫥: hideCode';
  } else {
    divStyle.display = 'none';
    e.target.textContent = '😁: showCode';
  }
};

const hideButton = Dom.create('button', {
  textContent: '🫥: hideCode',
  setStyles: {
    margin: '0.5rem',
    height: '2rem',
  },
  addEventListener: {
    type: 'click',
    listener: {
      targetDiv: editorDiv,
      handleEvent: hideButtonHandleEvent,
    },
  },
});


const summaryTextContent = (bool) => `📝 Editor: ${bool ? 'close' : 'open'}`;
const initDetailsOpen = false;

const summary = Dom.create('summary', {
  setStyles: {
    'font-family':
      'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
    padding: '0.5rem 1rem',
  },
  textContent: summaryTextContent(initDetailsOpen),
});

const wrapSummary = Dom.create('div', {
  setStyles: {
    display: 'flex',
    'justify-content': 'space-between',
  },
  //appendChildren: [Dom.create('div'), hideButton],
});




const details = Dom.create('details', {
  setAttrs: {
    id: 'details',
    //open: `${initDetailsOpen}`,
  },
  addEventListener: {
    type: 'toggle',
    listener: {
      targetSummary: summary,
      targetDiv: editorDiv,
      handleEvent: function (e) {
        this.targetSummary.textContent = summaryTextContent(e.target.open);
        console.log(e.target.open)
        /*
        `menu: ${
          e.target.open ? 'close' : 'open'
        }`;
        */
        this.targetDiv.style.display = e.target.open ? '' : 'none';
      },
    },
  },
  appendChildren: [summary, wrapSummary],
});

const headerHandleEvent = function () {
  const header = document.querySelector('#header');
  const offsetTop = window.visualViewport.offsetTop;
  header.style.top = `${offsetTop}px`;
};

const header = Dom.create('header', {
  setAttrs: {
    id: 'header',
  },
  setStyles: {
    // 'background-color': `var(--backGround-color-scheme, light-dark(#f2f2f7, #1c1c1e))`,
    'background-color': `var(--accessory-backGround-color-scheme)`,
    //'mix-blend-mode': 'luminosity',

    position: 'sticky',
    width: '100%',
    top: '0',
    'z-index': '1',
  },
  targetAddEventListeners: [
    {
      target: window.visualViewport,
      type: 'resize',
      listener: {
        handleEvent: headerHandleEvent,
      },
    },
    {
      target: window.visualViewport,
      type: 'scroll',
      listener: {
        handleEvent: headerHandleEvent,
      },
    },
  ],
  appendChildren: [details],
});




const buttonFactory = (buttonIconChar, actionHandle) => {
  function createFrame(width, height) {
    return Dom.create('div', {
      setStyles: {
        'min-width': `${width}`,
        height: `${height}`,
        display: 'flex',
        'justify-content': 'center',
        'align-items': 'center',
      },
    });
  }

  const btnW = '2.4rem';
  const btnH = '1.8rem';
  const btnRadius = '16%';

  const createActionButton = (iconChar) => {
    const icon = Dom.create('span', {
      textContent: `${iconChar}`,
      setStyles: {
        'font-family':
          'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
        'font-size': '1.0rem',
        color: '#f2f2f7',
      },
    });

    const button = Dom.create(createFrame('98%', '98%'), {
      setStyles: {
        'border-radius': `${btnRadius}`,
        'background-color': '#8e8e93', // light gray
        filter: 'drop-shadow(2px 2px 2px rgba(28, 28, 30, 0.9))',
      },
      appendChildren: [icon],
    });

    return Dom.create(createFrame(btnW, btnH), {
      setStyles: {
        cursor: 'pointer',
      },
      appendChildren: [button],
    });
  };

  const actionButton = createActionButton(buttonIconChar);
  actionButton.addEventListener('click', actionHandle);

  return actionButton;
};





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
  '⤻': {
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
  return buttonFactory(str, fnc);
});


const buttonsWrap = Dom.create('div', {
  setStyles: {
    width: '100%',
    'box-sizing': 'border-box',
    padding: '0.4rem',
    display: 'flex',
    // 'justify-content': 'space-around',
    'justify-content': 'space-between',
  },

  appendChildren: [...buttons],
});

let caret, headLine, endLine;
const divStep = 16;
let swipeAreaWidth, stepValue;
let startX = 0;


/*

d: 383838 75
56
0.21

l: 56585C 87
86,88,92


210
213
222

https://developer.apple.com/design/human-interface-guidelines/virtual-keyboards

 */


const footerHandleEvent = function () {
  const footer = document.querySelector('#footer');
  if (!this.targetEditor.hasFocus) {
    footer.style.display = 'none';
    return;
  }
  footer.style.display = '';

  //footer.style.display = this.targetEditor.hasFocus ?  'flex': 'none';
  const offsetTop = window.visualViewport.offsetTop;
  const offsetBottom =
    window.innerHeight -
    window.visualViewport.height +
    offsetTop -
    window.visualViewport.pageTop;
  footer.style.bottom = `${offsetBottom}px`;
};

const footer = Dom.create('footer', {
  setAttrs: {
    id: 'footer',
  },
  setStyles: {
    //'background-color': `var(--backGround-color-scheme, light-dark(#f2f2f7, #1c1c1e))`,
    'background-color': `var(--accessory-backGround-color-scheme)`,
    position: 'sticky',
    width: '100%',
    'box-sizing': 'border-box',
    bottom: '0',
    'display': 'none',
  },
  targetAddEventListeners: [
    {
      target: window.visualViewport,
      type: 'resize',
      listener: {
        targetEditor: editor,
        handleEvent: footerHandleEvent,
      },
    },
    {
      target: window.visualViewport,
      type: 'scroll',
      listener: {
        targetEditor: editor,
        handleEvent: footerHandleEvent,
      },
    },
  ],
  addEventListeners: [
  
    {
      type: 'touchstart',
      listener: {
        targetEditor: editor,
        handleEvent: function (e) {
          //e.preventDefault(); // xxx: 変化要確認
          if (!this.targetEditor.hasFocus) {
            return;
          }
  
          const selectionMain = this.targetEditor.state.selection.main;
          caret = selectionMain.anchor;
          headLine = this.targetEditor.moveToLineBoundary(selectionMain, 0).anchor;
          endLine = this.targetEditor.moveToLineBoundary(selectionMain, 1).anchor;
  
          swipeAreaWidth = document.querySelector('#footer').clientWidth;
          stepValue = swipeAreaWidth / divStep;
          startX = e.changedTouches[0].clientX;
        },
      },
    },
  
    {
      type: 'touchmove',
      listener: {
        targetEditor: editor,
        handleEvent: function (e) {
          e.preventDefault(); // xxx: 変化要確認
          if (!this.targetEditor.hasFocus) {
            return;
          }
  
          const swipeX = e.changedTouches[0].clientX;
  
          const moveDistance = swipeX - startX;
          const moveCache = Math.abs(moveDistance) < stepValue ? caret : caret + Math.round(moveDistance / stepValue);
  
          if (caret === moveCache) {
            return;
          }
  
          const moveValue = moveCache < headLine ? headLine : moveCache >= endLine ? endLine : moveCache;
  
          this.targetEditor.dispatch({
            selection: EditorSelection.create([EditorSelection.cursor(moveValue)]),
          });
          this.targetEditor.focus();
        },
      },
    },
  ],
  appendChildren: [buttonsWrap],
});

const setLayout = () => {
  const rootMain = Dom.create('div', {
    setAttrs: {id: 'rootMain'},
    setStyles: {
      display: 'grid',
      'grid-template-rows': 'auto 1fr auto',
      height: '100%',
      overflow: 'auto',
    },
    appendChildren: [header, editorDiv],
  });

  //rootMain.appendChild(footer);
  if (IS_TOUCH_DEVICE) {
    rootMain.appendChild(footer);
  }
  document.body.appendChild(rootMain);
};

document.addEventListener('DOMContentLoaded', () => {
  setLayout();
  insertFetchDoc(codeFilePath).then((loadedSource) => {
    // todo: 事前に`doc` が存在するなら、`doc` 以降にテキストを挿入
    editor.dispatch({
      changes: {from: editor.state?.doc.length, insert: loadedSource},
    });
  });
});

