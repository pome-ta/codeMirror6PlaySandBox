import Editor from './editor/index.js';

/* -- load Source */
async function insertSourceDoc(filePath) {
  const fetchFilePath = async (path) => {
    const res = await fetch(path);
    return await res.text();
  };
  return await fetchFilePath(filePath);
}

// --- main

function createRootDiv() {
  const element = document.createElement('div');
  element.id = 'root';
  element.style.cssText = `height: 100svh; width: 100%`;
  element.style.overflowY = 'scroll';

  return element;
}

function createEditorDiv() {
  const element = document.createElement('div');
  element.id = 'editor-div';
  element.style.cssText = `height: 100%; width: 100%; background-color: maroon`;

  return element;
}

// const codeFilePath = './js/editor/index.js';
const codeFilePath = './js/main.js';

const rootDiv = createRootDiv();
const editorDiv = createEditorDiv();
const editor = Editor.create(editorDiv);

document.addEventListener('DOMContentLoaded', () => {
  rootDiv.appendChild(editorDiv);
  document.body.appendChild(rootDiv);

  insertSourceDoc(codeFilePath).then((loadedSource) => {
    // todo: 事前に`doc` が存在するなら、`doc` 以降にテキストを挿入
    editor.dispatch({
      changes: { from: editor.state.doc.length, insert: loadedSource },
    });
  });
});

// window.addEventListener('load', () => {
//   console.log(editor.hasFocus);
// });
