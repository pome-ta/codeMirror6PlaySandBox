import {
  editor,
  editorDiv,
  undo,
  redo,
  EditorSelection,
} from './app.bundle.js';

const btnW = '2.5rem';
const btnRadius = '16%';

function createAccessory() {
  const ele = document.createElement('div');
  ele.id = 'operationWrap';
  ele.style.width = '100%';
  ele.style.height = '3rem';
  ele.style.padding = '0.2rem';
  ele.style.backgroundColor = '#1c1c1e80'; // Gray6
  // ele.style.backgroundColor = '#1c1c1e'; // Gray6
  ele.style.display = 'flex';
  ele.style.alignItems = 'center';
  return ele;
}

const operationDiv = createAccessory('div');

const logAreaDiv = document.createElement('div');
logAreaDiv.style.padding = '0.2rem';
// const logSpan = document.createElement('span');
const logParagraph = document.createElement('p');
logParagraph.textContent = 'log area & move caret';
logParagraph.style.height = '100%';
logParagraph.style.margin = 0;
logParagraph.style.fontSize = '0.8rem';
// logParagraph.style.backgroundColor = 'red';
logParagraph.style.backgroundColor = '#8e8e9380';
logParagraph.style.color = '#d1d1d6'; // light Gray4
logAreaDiv.id = 'logAreaWrap';
logAreaDiv.style.flexGrow = '1';
logAreaDiv.style.height = '100%';
// logAreaDiv.style.backgroundColor = '#bcbcbc';
logAreaDiv.appendChild(logParagraph);

function _createButtonWrap(width, height) {
  const wrap = document.createElement('div');
  wrap.style.width = width;
  wrap.style.height = height;
  wrap.style.display = 'flex';
  wrap.style.justifyContent = 'center';
  wrap.style.alignItems = 'center';
  return wrap;
}

function createIcon(char) {
  const icon = document.createElement('span');
  icon.textContent = char;
  icon.style.fontSize = '1.2rem';
  //icon.style.fontWeight = 900;
  // icon.style.color = '#fefefe';
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
  // button.style.backgroundColor = '#ababab';
  button.style.backgroundColor = '#8e8e93'; // light gray
  button.appendChild(icon);
  return wrap;
}
const leftButton = createActionButton('↼');
const rightButton = createActionButton('⇀');
const selectAllButton = createActionButton('⎁');
const redoButton = createActionButton('⤻');
const undoButton = createActionButton('⤺');

operationDiv.appendChild(logAreaDiv);
operationDiv.appendChild(leftButton);
operationDiv.appendChild(rightButton);
operationDiv.appendChild(selectAllButton);
operationDiv.appendChild(redoButton);
operationDiv.appendChild(undoButton);

const container = document.createElement('div');
container.style.width = '100%';
container.style.height = '100%';
container.style.display = 'grid';
container.style.gridTemplateRows = '1fr auto';

editorDiv.style.height = '100%';
editorDiv.style.overflow = 'auto';

document.body.appendChild(container);
container.appendChild(editorDiv);
container.appendChild(operationDiv);

operationDiv.style.display = 'none';
// operationDiv.style.position = 'fixed';
operationDiv.style.position = 'sticky';
operationDiv.style.zIndex = 1;
operationDiv.style.bottom = 0;

function visualViewportHandler() {
  if (editor.hasFocus) {
    operationDiv.style.display = 'flex';
    //document.body.style.backgroundColor = 'blue';
  } else {
    operationDiv.style.display = 'none';
    //document.body.style.backgroundColor = 'yellow';
  }

  const upBottom =
    window.innerHeight -
    visualViewport.height +
    visualViewport.offsetTop -
    visualViewport.pageTop;

  const editorDivHeight = container.offsetHeight - operationDiv.offsetHeight;

  operationDiv.style.bottom = `${upBottom}px`;
  editorDiv.style.height = `${editorDivHeight}px`;
}

visualViewport.addEventListener('scroll', visualViewportHandler);
visualViewport.addEventListener('resize', visualViewportHandler);

undoButton.addEventListener('click', () => {
  undo(editor);
  editor.focus();
});

redoButton.addEventListener('click', () => {
  redo(editor);
  editor.focus();
});

selectAllButton.addEventListener('click', () => {
  const endRange = editor.state.doc.length;
  const transaction = {
    selection: EditorSelection.create([EditorSelection.range(0, endRange)]),
  };
  editor.dispatch(transaction);
  editor.focus();
});

// todo: MouseEvent TouchEvent wrapper
const { touchBegan, touchMoved, touchEnded } = {
  touchBegan:
    typeof document.ontouchstart !== 'undefined' ? 'touchstart' : 'mousedown',
  touchMoved:
    typeof document.ontouchmove !== 'undefined' ? 'touchmove' : 'mousemove',
  touchEnded:
    typeof document.ontouchend !== 'undefined' ? 'touchend' : 'mouseup',
};

let caret = 0;
let startX = 0;
let endX = 0;

function moveCaret(pos) {
  editor.dispatch({
    selection: EditorSelection.create([EditorSelection.cursor(pos)]),
  });
  editor.focus();
}

leftButton.addEventListener('click', () => {
  caret = editor.state.selection.main.anchor;
  caret -= 1;
  moveCaret(caret);
});

rightButton.addEventListener('click', () => {
  caret = editor.state.selection.main.anchor;
  caret += 1;
  moveCaret(caret);
});

function logAreaSwipeStart(event) {
  caret = editor.state.selection.main.anchor;
  // todo: mobile しか想定していないけども
  startX = event.touches ? event.touches[0].pageX : event.pageX;
}

function logAreaSwipeMove(event) {
  event.preventDefault();
  // todo: mobile しか想定していないけども
  // xxx: ドラッグでの移動
  endX = event.touches ? event.touches[0].pageX : event.pageX;
  const moveDistance = Math.round((endX - startX) / 10);
  startX = endX;
  caret += moveDistance;
  const cursor = caret >= 0 ? caret : 0;
  logParagraph.textContent = `${cursor}: ${moveDistance}`;
  moveCaret(cursor);
}

logAreaDiv.addEventListener(touchBegan, logAreaSwipeStart);

logAreaDiv.addEventListener(touchMoved, logAreaSwipeMove);

window.addEventListener('resize', () => {
  visualViewportHandler();
});
