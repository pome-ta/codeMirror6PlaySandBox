import Editor from './editor/main.js';

const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';
//editorDiv.style.backgroundColor = 'dodgerblue'
//editorDiv.style.backgroundColor = 'darkslategray';

const docs = `import { minimalSetup } from './codemirror/codemirror.js';
import { EditorState, } from './codemirror/state.js';
import { EditorView, lineNumbers, highlightActiveLineGutter } from './codemirror/view.js';
import { closeBrackets, autocompletion } from './codemirror/autocomplete.js';


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
  },
  { dark: true },
);






const initializeSetup = [
  minimalSetup,
  lineNumbers(),
  highlightActiveLineGutter(),
  closeBrackets(),
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
`;

const editor = new Editor(editorDiv, docs);

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(editorDiv);
});
