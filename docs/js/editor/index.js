import { minimalSetup } from './codemirror/codemirror.js';
import { EditorState, Compartment, } from './codemirror/state.js';
import { EditorView, lineNumbers, highlightActiveLineGutter,
  highlightActiveLine,
  highlightSpecialChars, highlightWhitespace, } from './codemirror/view.js';
import { closeBrackets, autocompletion } from './codemirror/autocomplete.js';
import { bracketMatching } from './codemirror/language.js';

import { javascript } from './codemirror/lang-javascript.js';
import { oneDark } from './codemirror/theme-one-dark.js';


/*
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
/*
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

const initTheme = EditorView.theme(
  {
    '&': {
      fontSize: '0.72rem',
      //fontSize: '1rem',
    },
    '.cm-scroller': {
      fontFamily:
        'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
    },
    '.cm-line': { padding: 0 },
    '&.cm-editor': {
      '&.cm-focused': {
        outline: '0px dotted #21212100',
      },
    },
    
    '.cm-highlightSpace': {
      backgroundImage: 'radial-gradient(circle at 50% 55%, #eee 20%, transparent 8%)',
    },
  },
);

//<span class="cm-highlightSpace"> </span>



const tabSize = new Compartment();

const initializeSetup = [
  minimalSetup,
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightActiveLine(),
  highlightWhitespace(),
  autocompletion(),
  closeBrackets(),
  bracketMatching(),
  EditorView.lineWrapping, // 改行
  tabSize.of(EditorState.tabSize.of(2)),
  javascript(),
  oneDark,
  initTheme,
];


class Editor {
  constructor(editorDiv, doc = '') {
    this.state = EditorState.create({
      doc: doc,
      extensions: initializeSetup,
    });
    this.editor = new EditorView({
      state: this.state,
      parent: editorDiv,
    })
  }
}

export default Editor;
