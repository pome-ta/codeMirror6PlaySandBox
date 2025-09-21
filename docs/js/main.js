import {EditorState} from '@codemirror/state';
import { EditorView,highlightWhitespace } from '@codemirror/view';
import {javascript} from '@codemirror/lang-javascript';
import {oneDark} from '@codemirror/theme-one-dark';

import { basicSetup} from 'codemirror';

// --- docs
const docs = `import { EditorView, lineNumbers } from '@codemirror/view';
import {Compartment, EditorState, StateEffect, StateField,} from '@codemirror/state';
import {javascript} from "@codemirror/lang-javascript";
import { basicSetup} from "codemirror";


const extensions = [
  basicSetup,
  lineNumbers(),
];

const state =EditorState.create({
    doc: 'hoge1loO0',
    extensions: extensions,
  });

const view = new EditorView({
  state: state,
  parent: document.body,
});
console.log(basicSetup);`
// --- docs/


const customTheme = EditorView.theme(
  {
    '&': {
        fontSize: '0.72rem', //fontSize: '1rem',
    },
    '.cm-scroller': {
      fontFamily:
        'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
    },
    // `highlightWhitespace` 調整
    '.cm-highlightSpace': {
      backgroundImage:
        'radial-gradient(circle at 50% 55%, #ababab 4%, transparent 24%)',
      opacity: 0.2,
    },

      
  },
  {dark: false},
);

const extensions = [
  basicSetup,
  EditorView.lineWrapping,
  //EditorState.readOnly.of(true),
  EditorView.editable.of(false),
  highlightWhitespace(),
  javascript(),
  customTheme,
  oneDark,
];

const state =EditorState.create({
    //doc: 'hoge',
    extensions: extensions,
  });

const view = new EditorView({
  state: state,
  parent: document.body,
});

view.dispatch({
  changes: {from: 0, to:view.state.doc.length, insert: docs}
  //changes: {insert: docs}
})

console.log(basicSetup);
