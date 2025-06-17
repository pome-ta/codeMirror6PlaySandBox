import Editor from './editor/index.js';

/* -- load Source */
async function initializeMainCall(filePath) {
  const fetchFilePath = async (path) => {
    const res = await fetch(path);
    return await res.text();
  };
  return await fetchFilePath(filePath);
}

function createRootDiv() {
  const element = document.createElement('div');
  element.id = 'root';
  element.style.cssText = `height: 100%; width: 100%`;

  return element;
}

function createEditorDiv() {
  const element = document.createElement('div');
  element.id = 'editor-div';
  element.style.height = '100svh';
  element.style.width = '100%';
  element.style.backgroundColor = 'maroon';

  return element;
}

let editor;

//const codeFilePath = './js/editor/index.js';
const codeFilePath = './js/main.js';

const editorDiv = createEditorDiv();
const rootDiv = createRootDiv();
rootDiv.appendChild(editorDiv);

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(rootDiv);
  initializeMainCall(codeFilePath).then((loadedSource) => {
    editor = Editor.create(editorDiv, loadedSource);
    console.log(editor);
  });
  
});
/*
window.addEventListener('load', () => {
  console.log(editor.hasFocus);
});
*/
