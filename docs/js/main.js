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


const accessoryDiv = document.createElement('div');
accessoryDiv.id = 'accessory-div';
accessoryDiv.style.padding = '0.2rem';
//accessoryDiv.style.backgroundColor = '#1c1c1e80'; // Gray6
accessoryDiv.style.backgroundColor = 'red';
// todo: 常に下部に表示
accessoryDiv.style.position = 'sticky';
accessoryDiv.style.bottom = 0;

accessoryDiv.style.height = '1.6rem';

//visualViewport.addEventListener('resize', ({ target }) => {
function visualViewportHandler({ target }) {
  console.log(target)
  const keyboardHeight = window.innerHeight - target.height;
  const bottomValue = keyboardHeight === 0 ? '' : `${keyboardHeight}px`;
  accessoryDiv.style.bottom = bottomValue;
};


visualViewport.addEventListener('scroll', visualViewportHandler);
visualViewport.addEventListener('resize', visualViewportHandler);

// main
initializeMainCall(codeFilePath).then((loadedSource) => {
  const editorDiv = setEditorDiv();
  const editor = new Editor(editorDiv, loadedSource);
  console.log(editor);
  
  document.body.appendChild(accessoryDiv)
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
