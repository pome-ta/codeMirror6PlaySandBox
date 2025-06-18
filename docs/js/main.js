import Editor from './editor/index.js';

/* --- load Source */
async function insertFetchDoc(filePath) {
  const fetchFilePath = async (path) => {
    const res = await fetch(path);
    return await res.text();
  };
  return await fetchFilePath(filePath);
}

/* --- window-document */

function createRootDiv() {
  const element = document.createElement('div');
  element.id = 'root';
  //element.style.cssText = `height: 100svh; width: 100%;`;
  element.style.cssText = `height: 100%; width: 100%;`;
  //element.style.overflowY = 'scroll';

  return element;
}

function createEditorDiv() {
  const element = document.createElement('div');
  element.id = 'editor-div';
  element.style.cssText = `height: 100%; width: 100%;`;
  //element.style.cssText = `height: 100svh; width: 100%;`;
  //  element.style.backgroundColor = 'maroon';

  return element;
}

// const codeFilePath = './js/editor/index.js';
const codeFilePath = './js/main.js';

const rootDiv = createRootDiv();
const editorDiv = createEditorDiv();
const editor = Editor.create(editorDiv);


/* --- accessory */

const accessoryStyle = `
  position: sticky;
  display: flex;
  align-items: center;
  width = 100%;
`;

function createHeader() {
  const h1Tag = document.createElement('h1');
  h1Tag.style.fontSize = '1.5rem';
  h1Tag.textContent = 'Safari Virtual Keyboard Demo';
  
  const element = document.createElement('header');
  element.id = 'header';
  element.style.cssText = accessoryStyle;
  element.style.top = '0';
  element.style.backgroundColor = 'maroon';
  element.style.zIndex = 1;
  
  element.appendChild(h1Tag);
  
  return element;
}


function createFooter() {
  const h1Tag = document.createElement('h1');
  h1Tag.style.fontSize = '1.5rem';
  h1Tag.textContent = 'Safari Virtual Keyboard Demo';
  
  const element = document.createElement('footer');
  element.id = 'footer';
  element.style.cssText = accessoryStyle;
  element.style.bottom = '0';
  element.style.backgroundColor = 'navy';
  //element.style.zIndex = 1;
  //element.style.cssText = accessoryStyle;
  
  element.appendChild(h1Tag);
  
  return element;
}

/*
element.style.position = 'sticky';
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    //element.style.justifyContent = 'stretch';
    element.style.width = '100%';
*/
const accessoryHeader = createHeader();
const accessoryFooter = createFooter();


const visualViewportHandler = () => {
console.log('---');
console.log(`window.innerHeight:${window.innerHeight}`);
console.log(`window.visualViewport.height:${window.visualViewport.height}`);
console.log(`window.visualViewport.height:${window.visualViewport.offsetTop}`);
    
  const offsetTop = visualViewport.offsetTop;
  const offsetBottom = window.innerHeight - window.visualViewport.height + offsetTop - window.visualViewport.pageTop;
  
  accessoryHeader.style.top = `${offsetTop}px`;
  accessoryFooter.style.bottom = `${offsetBottom}px`;
  //accessoryFooter.style.bottom = `${window.visualViewport.height}px`;
}


window.visualViewport.addEventListener('resize', visualViewportHandler);
window.visualViewport.addEventListener('scroll', visualViewportHandler);


document.addEventListener('DOMContentLoaded', () => {
  rootDiv.appendChild(accessoryHeader);
  rootDiv.appendChild(editorDiv);
  rootDiv.appendChild(accessoryFooter);
  document.body.appendChild(rootDiv);

  insertFetchDoc(codeFilePath).then((loadedSource) => {
    // todo: 事前に`doc` が存在するなら、`doc` 以降にテキストを挿入
    editor.dispatch({
      changes: { from: editor.state.doc.length, insert: loadedSource },
    });
  });
});

// window.addEventListener('load', () => {
//   console.log(editor.hasFocus);
// });
