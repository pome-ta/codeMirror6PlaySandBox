import {
  EditorView,
  EditorState,
  initExtensions,
  editorDiv,
} from './modules/cmEditor.bundle.js';

/* -- main */
const container = document.createElement('main');
container.id = 'container-main';
container.style.height = '100%';

document.body.appendChild(container).appendChild(editorDiv);

const extensions = [...initExtensions];
const state = EditorState.create({
  doc: 'hoge',
  extensions: extensions,
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});
