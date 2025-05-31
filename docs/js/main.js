import Editor from './editor/index.js';

const codePath = './js/editor/index.js';


/* -- load Source */
async function fetchSketchFile(path) {
  const res = await fetch(path);
  const sketchText = await res.text();
  return sketchText;
}


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
