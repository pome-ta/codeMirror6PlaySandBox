import Editor from './editor/index.js';

//const codeFilePath = './js/editor/index.js';
const codeFilePath = './js/main.js';



/* -- load Source */
async function initializeMainCall(filePath) {

  const fetchFilePath = async (path) => {
    const res = await fetch(path);
    return await res.text();
  }

  return await fetchFilePath(filePath);
}


const createEditorDiv = () => {
  const element = document.createElement('div');
  element.id = 'editor-div';
  element.style.height = '100svh';
  element.style.width = '100%';
  element.style.backgroundColor = 'maroon';

  return element;
};

let editor;
const editorDiv = createEditorDiv();


document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(editorDiv);
  initializeMainCall(codeFilePath).then((loadedSource) => {
    editor = new Editor(editorDiv, loadedSource);
  });
  
  

});

window.addEventListener('load', ()=>{
  console.log(editor)
})
