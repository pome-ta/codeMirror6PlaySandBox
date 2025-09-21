import { EditorView, lineNumbers } from '@codemirror/view';
import {Compartment, EditorState, StateEffect, StateField,} from '@codemirror/state';


const extensions = [
  lineNumbers,
];

const state =EditorState.create({
    doc: 'hoge1loO0',
    //extensions: extensions,
  });

const view = new EditorView({
  state: state,
  parent: document.body,
});
console.log(view);
