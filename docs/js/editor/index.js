import { minimalSetup } from './codemirror/codemirror.js';
import { Compartment, EditorState } from './codemirror/state.js';
import {
  EditorView,
  highlightActiveLine,
  highlightActiveLineGutter,
  highlightWhitespace,
  lineNumbers,
} from './codemirror/view.js';
import { autocompletion, closeBrackets } from './codemirror/autocomplete.js';
import { bracketMatching } from './codemirror/language.js';

import { javascript } from './codemirror/lang-javascript.js';
import { oneDark } from './codemirror/theme-one-dark.js';

/* ref: `basicSetup` の宣言内容
const basicSetup = (() => [
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightSpecialChars(),
    history(),
    foldGutter(),
    drawSelection(),
    dropCursor(),
    EditorState.allowMultipleSelections.of(true),
    indentOnInput(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    bracketMatching(),
    closeBrackets(),
    autocompletion(),
    rectangularSelection(),
    crosshairCursor(),
    highlightActiveLine(),
    highlightSelectionMatches(),
    keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...completionKeymap,
        ...lintKeymap
    ])
])();
*/
/*  ref: `minimalSetup` の宣言内容
const minimalSetup = (() => [
    highlightSpecialChars(),
    history(),
    drawSelection(),
    syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
    keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
    ])
])();

*/

const initTheme = EditorView.theme({
  '&': {
    fontSize: '0.64rem', //fontSize: '1rem',
  },
  '.cm-scroller': {
    fontFamily:
      'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
  },

  '.cm-line': {
    padding: '0 0.5px',
  },

  '&.cm-editor': {
    '&.cm-focused': {
      outline: '0px dotted #21212100',
    },
  },

  // `highlightWhitespace` 調整
  '.cm-highlightSpace': {
    backgroundImage:
      'radial-gradient(circle at 50% 55%, #ababab 4%, transparent 24%)',
    opacity: 0.2,
  },
});

const tabSize = new Compartment();

const initializeSetup = [
  minimalSetup,
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightActiveLine(),
  highlightWhitespace(),
  //dropCursor(),
  /*
  autocompletion({
    activateOnTypingDelay: 5,  // 100
    closeOnBlur: false,  // true
    maxRenderedOptions: 5,  // 100
    interactionDelay: 75,  // 75
    updateSyncTime: 10000,  // 100
  }),
  */
  autocompletion(),
  closeBrackets(),
  bracketMatching(),
  EditorView.lineWrapping, // 改行
  tabSize.of(EditorState.tabSize.of(2)),
  javascript(),
  oneDark,
  initTheme,
];

/*
class Editor {
  #editorView;

  constructor(editorDiv, doc = '') {
    const state = EditorState.create({
      doc: doc,
      extensions: initializeSetup,
    });

    this.#editorView = new EditorView({
      state: state,
      parent: editorDiv,
    });
  }

  get editorView() {
    return this.#editorView;
  }

  static create(editorDiv, doc = '') {
    const instance = new this(editorDiv, doc);
    return instance.editorView;
  }
}

export default Editor;
*/

const createEditorView = (editorDiv, doc = '', customSetup = null) => {
  const extensions = customSetup === null ? initializeSetup : customSetup;
  const state = EditorState.create({
    doc: doc,
    extensions: extensions,
  });
  return new EditorView({
    state: state,
    parent: editorDiv,
  });
};

export default createEditorView;
