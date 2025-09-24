import {EditorState,} from '@codemirror/state';
import {EditorView,} from '@codemirror/view';

import {javascript} from '@codemirror/lang-javascript';
//import {minimalSetup} from 'codemirror';
import {basicSetup} from 'codemirror';




// --- docs
const docs = `import { EditorView, lineNumbers } from '@codemirror/view';
import {Compartment, EditorState, StateEffect, StateField,} from '@codemirror/state';
import {javascript} from "@codemirror/lang-javascript";
import { basicSetup} from "codemirror";


const extensions = [
  basicSetup,
  javascript(),
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
      fontFamily: 'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
      fontSize: '0.72rem',
    },
  },
  {
    dark: false,
  },
);




const extensions = [
  basicSetup,
  customTheme,
  javascript(),
];

const state = EditorState.create({
  extensions: extensions,
});

const view = new EditorView({
  state: state,
  parent: document.body,
});

view.dispatch({
  changes: {
    from: 0,
    to: view.state.doc.length,
    insert: docs,
  },
});


