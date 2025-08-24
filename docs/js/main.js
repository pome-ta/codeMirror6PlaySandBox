import { EditorView } from '@codemirror/view';

const view = new EditorView({
  doc: 'hoge',
  parent: document.body,
});
console.log(view);
