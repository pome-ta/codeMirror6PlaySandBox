import Editor from './editor/index.js';

const codeFilePath = './js/editor/index.js';

/* -- load Source */
async function fetchFilePath(path) {
  const res = await fetch(path);
  return await res.text();
}

async function initializeMainCall(filePath) {
  return await fetchFilePath(filePath);
}

const setEditorDiv = (element = document.body) => {
  const div = document.createElement('div');
  div.id = 'editor-div';
  div.style.width = '100%';
  // div.style.backgroundColor = 'dodgerblue'
  // div.style.backgroundColor = 'darkslategray';
  element.appendChild(div);
  return div;
};


// main
initializeMainCall(codeFilePath).then((loadedSource) => {
  const editorDiv = setEditorDiv();
  const editor = new Editor(editorDiv, loadedSource);
  console.log(editor);
});

/*
const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';
//editorDiv.style.backgroundColor = 'dodgerblue'
//editorDiv.style.backgroundColor = 'darkslategray';

const docs = `import { minimalSetup } from './codemirror/codemirror.js';`;

const editor = new Editor(editorDiv, docs);

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(editorDiv);
});
*/
