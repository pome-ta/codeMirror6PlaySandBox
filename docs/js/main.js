import { basicSetup, EditorView } from 'codemirror';

const view = new EditorView({
  doc: 'hoge',
  extensions: [basicSetup],
  parent: document.body,
});
console.log(view);
