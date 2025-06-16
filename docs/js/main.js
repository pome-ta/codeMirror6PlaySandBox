import Editor from './editor/index.js';


let editor
//const codeFilePath = './js/editor/index.js';
const codeFilePath = './js/main.js';



const ua = window.navigator.userAgent;
const iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);


class Elementer {
  // header footer をいい感じに管理したい(Elementor じゃなくてもいいか、、)
  #element;
  
  constructor(type, idName=null, classNames=[]) {
    this.#element = document.createElement(type);
    if (idName !== null) {
      this.#element.id = idName
    }
    classNames.forEach((name)=>{
      this.#element.classList.add(nsme);
    });
    
    this.addStyles();
  }
  
  addStyles() {
    this.#element.style.position = 'sticky';
    this.#element.style.display = 'flex';
    this.#element.style.alignItems = 'center';
    this.#element.style.width = '100%';
  }
  
  get element() {
    return this.#element
  }
  
  static of(type, idName, classNames) {
    const instance = new this(type, idName, classNames);
    return instance.element;
  }
}



const headerCreate = (idName=null, classNames=[]) =>{
  const element = Elementer.of('header', idName, classNames);
  element.style.top = '0';
  element.style.backgroundColor = 'maroon';
  element.style.zIndex = 1;

  return element;
}

class AccessoryWidget {
  constructor(cmEditor, isMobile) {
    this.editor = cmEditor;
  }
}


function visualViewportHandler() {
  //footerDiv.style.display = editor.hasFocus ? 'flex' : 'none';
  
  const upBottom =
    window.innerHeight -
    window.visualViewport.height +
    window.visualViewport.offsetTop -
    window.visualViewport.pageTop;

  headerDiv.style.top = `${visualViewport.offsetTop}px`;
  footerDiv.style.bottom = `${upBottom}px`;
}



/* -- load Source */
async function fetchFilePath(path) {
  const res = await fetch(path);
  return await res.text();
}

async function initializeMainCall(filePath) {
  return await fetchFilePath(filePath);
}

const createRootDiv = () => {
  const element = document.createElement('div');
  element.id = 'root';
  element.classList.add('scrollable');
  //element.style.backgroundColor = 'red';
  // element.style.width = '100vw';
  element.style.width = '100%';
  //element.style.height = `calc(100 * var(--svh, 1svh))`;
  element.style.height = '100svh';
  element.style.overflowY = 'scroll';
  //element.style.overflowX = 'hidden';

  return element;
};

const createHeader = () => {
  const element = document.createElement('header');
  element.id = 'header';
  const h1Tag = document.createElement('h1');
  h1Tag.style.fontSize = '1.5rem';
  h1Tag.textContent = 'Safari Virtual Keyboard Demo';

  element.appendChild(h1Tag);
  element.style.top = '0';
  element.style.backgroundColor = 'maroon';
  //element.style.backgroundColor = 'red';
  element.style.zIndex = 1;

  return element;
};

const createEditorDiv = () => {
  const element = document.createElement('div');
  element.id = 'editor-div';
  //element.style.minHeight = `calc(100 * var(--svh, 1svh) - 96px)`;
  element.style.width = '100%';

  return element;
};




const createFooter = () => {
  const element = document.createElement('footer');
  element.id = 'footer';
  element.style.padding = '0.6rem 0';
  element.style.justifyContent = 'space-around';
  //element.style.padding = '0.2rem';
  element.style.backgroundColor = 'maroon';
  element.style.bottom = '0';

  return element;
};

const addHeaderFooterStyle = (headerFooter) => {
  // xxx: 配列？🤔
  [...headerFooter].forEach((element) => {
    element.style.position = 'sticky';
    element.style.display = 'flex';
    element.style.alignItems = 'center';
    //element.style.justifyContent = 'stretch';
    element.style.width = '100%';
    //element.style.height = '3rem';
  });
};

const createButton = (id, textContent) => {
  const element = document.createElement('button');
  element.id = id;
  element.style.type = 'button';
  element.textContent = textContent;

  element.style.fontSize = '1rem';
  element.style.padding = '0.5rem';
  element.style.appearance = 'none';
  element.style.height = '100%';
  element.style.flex = '1';
  return element;
};


const btnW = '2.5rem';
const btnRadius = '16%';

function _createButtonWrap(width, height) {
  const wrap = document.createElement('div');
  // xxx: 最大数問題
  wrap.style.minWidth = width;
  wrap.style.height = height;
  wrap.style.display = 'flex';
  wrap.style.justifyContent = 'center';
  wrap.style.alignItems = 'center';
  return wrap;
}

function createIcon(char) {
  const icon = document.createElement('span');
  icon.textContent = char;
  icon.style.fontSize = '1.0rem';
  icon.style.color = '#f2f2f7'; // gray6
  return icon;
}

function createActionButton(iconChar) {
  const wrap = _createButtonWrap(btnW, '100%');
  const button = _createButtonWrap('90%', '90%');
  const icon = createIcon(iconChar);
  wrap.appendChild(button);
  wrap.style.cursor = 'pointer';
  button.style.borderRadius = btnRadius;
  button.style.backgroundColor = '#8e8e93'; // light gray
  button.style.filter = 'drop-shadow(2px 2px 2px rgba(28, 28, 30, 0.9))';
  button.appendChild(icon);
  return wrap;
}

const stickyButton = createButton('stickyButton', 'Sticky');
const fixedButton = createButton('fixedButton', 'Fixed');
const clearButton = createButton('clearButton', 'Clear');


const rootDiv = createRootDiv();
const editorDiv = createEditorDiv();
//const headerDiv = createHeader();
const headerDiv = headerCreate('header');
const footerDiv = createFooter();
//addHeaderFooterStyle([headerDiv, footerDiv]);
addHeaderFooterStyle([footerDiv]);

const [
  commentButton,
  selectLineButton,
  leftButton,
  downButton,
  upButton,
  rightButton,
  selectAllButton,
  redoButton,
  undoButton,
  //reIndentButton,
] = ['//', '▭', '←', '↓', '↑', '→', '⎁', '⤻', '⤺'].map((str) => {
  const ele = createActionButton(str);
  footerDiv.appendChild(ele);
  return ele;
});



//footerDiv.appendChild(buttonArea);
//footerDiv.appendChild(fixedButton);
//footerDiv.appendChild(clearButton);

document.addEventListener('DOMContentLoaded', () => {
  rootDiv.appendChild(headerDiv);
  rootDiv.appendChild(editorDiv);
  rootDiv.appendChild(footerDiv);
  document.body.appendChild(rootDiv);
  initializeMainCall(codeFilePath).then((loadedSource) => {
    editor = new Editor(editorDiv, loadedSource);
  });
  
  
  
  /*
  
  if (!iOS) {
    return;
  }
  */
  
  visualViewportHandler();
  window.visualViewport.addEventListener('resize', visualViewportHandler);
  window.visualViewport.addEventListener('scroll', visualViewportHandler);
  
});
