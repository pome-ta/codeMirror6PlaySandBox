import Editor from './editor.js';

const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';
editorDiv.style.backgroundColor = 'dodgerblue'


const editor = new Editor(editorDiv, 'hoge( fuga- )');

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(editorDiv);
});