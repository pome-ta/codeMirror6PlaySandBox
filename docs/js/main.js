import { EditorView, lineNumbers } from '@codemirror/view';
import {Compartment, EditorState, StateEffect, StateField,} from '@codemirror/state';
import {javascript} from "@codemirror/lang-javascript";
import { basicSetup} from "codemirror";


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


const extensions = [
  basicSetup,
  lineNumbers(),
];

const state =EditorState.create({
    doc: docs,
    extensions: extensions,
  });

const view = new EditorView({
  state: state,
  parent: document.body,
});
console.log(basicSetup);
