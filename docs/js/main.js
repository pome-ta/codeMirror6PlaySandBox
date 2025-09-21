import { EditorView } from '@codemirror/view';
import {EditorState} from '@codemirror/state';
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

😉

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

const extensions = [
  basicSetup,
  EditorView.lineWrapping,
  //EditorState.readOnly.of(true),
  EditorView.editable.of(false),
  javascript(),
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
