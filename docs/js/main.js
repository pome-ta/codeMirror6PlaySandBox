import Editor from './editor/index.js';

//const codeFilePath = './js/editor/index.js';
const codeFilePath = './js/main.js';



/* -- load Source */
async function fetchFilePath(path) {
  const res = await fetch(path);
  return await res.text();
}

async function initializeMainCall(filePath) {
  return await fetchFilePath(filePath);
}


const setRootDiv = () => {
  const div = document.createElement('div');
  div.id = 'root-div';
  div.style.width = '100%';
  div.style.height = '100%';
  div.style.display = 'flex';
  div.style.flexDirection = 'column';
  div.style.position = 'relative';
  document.body.appendChild(div);
  return div;
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

const accessoryFooter = document.createElement('footer');
accessoryFooter.style.width = '100%';
accessoryFooter.style.height = '40px';
accessoryFooter.style.backgroundColor = 'maroon';
accessoryFooter.textContent = 'hoge';
/*
accessoryFooter.style.position = 'sticky';
accessoryFooter.style.bottom = -100;
*/
accessoryFooter.style.position = 'sticky';
accessoryFooter.style.bottom = 0;
accessoryFooter.style.zIndex = 1;

const rootDiv = setRootDiv()
const editorDiv = setEditorDiv(rootDiv);
//rootDiv.appendChild(accessoryFooter)
document.body.appendChild(accessoryFooter)
/*
document.body.addEventListener('touchstart', ()=>{
  console.log(`touchstart: ${document.body.clientHeight}`);
  console.log(`visualViewport: ${window.visualViewport.height}`);
});
*/


document.addEventListener('DOMContentLoaded', () => {

  initializeMainCall(codeFilePath).then((loadedSource) => {
  
    const editor = new Editor(editorDiv, loadedSource);
    //console.log(editor);
    //console.log(`initializeMainCall: ${window.innerHeight}`);
    //document.body.appendChild(accessoryDiv)
  });
  console.log(`DOMContentLoaded: ${window.innerHeight}`);
});



function viewportHandler() {
  const visualViewport = window.visualViewport

  const offsetLeft = visualViewport.offsetLeft

  // documentElement.clientHeight は Layout Viewport の高さとなる
  /*
  const offsetTop = accessoryFooter.offsetHeight +
    visualViewport.offsetTop +
    visualViewport.height -
    document.documentElement.clientHeight
  */
    
    
    
  const offsetTop = window.innerHeight
    - window.visualViewport.height
    + window.visualViewport.offsetTop
    - window.visualViewport.pageTop;

  /*
  // 絵文字ボタンを Visual Viewport の下端に合わせる
  const translate = `translate(${offsetLeft}px, ${offsetTop}px)`

  // 絵文字ボタンの大きさを常に同じにするため、現在の拡大率で割る
  const scale = `scale(${1 / visualViewport.scale})`

  accessoryFooter.style.transform = `${translate} ${scale}`
  */
  accessoryFooter.style.bottom = `${offsetTop}px`;
}

window.visualViewport.addEventListener('scroll', viewportHandler)
window.visualViewport.addEventListener('resize', viewportHandler)
document.body.addEventListener('touchstart', viewportHandler)
