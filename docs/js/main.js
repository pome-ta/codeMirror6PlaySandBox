import {
  editor,
  editorDiv,
  undo,
  redo,
  EditorSelection,
} from './app.bundle.js';

const btnW = '2.5rem';
const btnRadius = '16%';

function createAccessory(height) {
  const ele = document.createElement('div');
  ele.id = 'operationWrap';
  ele.style.width = '100%';
  // ele.style.height = '3rem';
  ele.style.height = height;
  ele.style.padding = '0.2rem';
  ele.style.backgroundColor = '#1c1c1e80'; // Gray6
  // ele.style.backgroundColor = '#1c1c1e'; // Gray6
  // ele.style.display = 'flex';
  // ele.style.alignItems = 'center';
  ele.style.display = 'grid';
  // ele.style.gridTemplateRows = '1fr auto';
  // ele.style.gridTemplateRows = 'auto auto';
  ele.style.gridTemplateRows = 'auto 1fr';
  return ele;
}

function createLogArea() {
  const ele = document.createElement('div');
  ele.style.padding = '0.2rem';
  // ele.style.flexGrow = '1';
  ele.style.height = '2.5rem';
  const pEle = document.createElement('p');
  pEle.textContent = 'area';
  pEle.style.height = '100%';
  pEle.style.margin = 0;
  pEle.style.fontSize = '0.8rem';
  pEle.style.backgroundColor = '#8e8e9380';
  pEle.style.color = '#d1d1d6'; // light Gray4
  ele.appendChild(pEle);
  return [ele, pEle];
}

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
  button.style.filter = 'drop-shadow(2px 2px 2px rgba(28, 28, 30, 0.9))';
  button.appendChild(icon);
  return wrap;
}

const accessoryDiv = createAccessory('5rem');
accessoryDiv.style.display = 'none';
accessoryDiv.style.position = 'sticky';
accessoryDiv.style.zIndex = 1;
accessoryDiv.style.bottom = 0;

const [logAreaDiv, logParagraph] = createLogArea();
const buttonArea = document.createElement('div');
buttonArea.style.width = '100%';
// buttonArea.style.height = '100%';
buttonArea.style.display = 'flex';
buttonArea.style.justifyContent = 'space-around';

const [
  commentButton,
  tabButton,
  equalButton,
  //plusButton,
  //minusButton,
  //mulButton,
  //divButton,
  //dotButton,
  commaButton,
  semicolonButton,
  leftButton,
  rightButton,
  selectAllButton,
  redoButton,
  undoButton,
] = [
  '//',
  '⇥',
  '=',
  //'+',
  //'-',
  //'*',
  //'/',
  //'.',
  ',',
  ';',
  '↼',
  '⇀',
  '⎁',
  '⤻',
  '⤺',
].map((str) => {
  const ele = createActionButton(str);
  buttonArea.appendChild(ele);
  return ele;
});

// [
//   commentButton,
//   tabButton,
//   equalButton,
//   plusButton,
//   minusButton,
//   mulButton,
//   divButton,
//   dotButton,
//   semicolonButton,
//   commaButton,
//   leftButton,
//   rightButton,
//   selectAllButton,
//   redoButton,
//   undoButton,
// ].forEach((ele) => buttonArea.appendChild(ele));

const container = document.createElement('div');
container.id = 'mainWrap';
container.style.width = '100%';
container.style.height = '100%';
container.style.display = 'grid';
container.style.gridTemplateRows = '1fr auto';

editorDiv.style.height = '100%';
editorDiv.style.overflow = 'auto';

document.body.appendChild(container);
container.appendChild(editorDiv);
container.appendChild(accessoryDiv);
[logAreaDiv, buttonArea].forEach((ele) => accessoryDiv.appendChild(ele));

function visualViewportHandler() {
  if (editor.hasFocus) {
    accessoryDiv.style.display = 'grid';
    // document.body.style.backgroundColor = 'blue';
  } else {
    accessoryDiv.style.display = 'none';
    //document.body.style.backgroundColor = 'yellow';
  }

  const upBottom =
    window.innerHeight -
    visualViewport.height +
    visualViewport.offsetTop -
    visualViewport.pageTop;

  const editorDivHeight = container.offsetHeight - accessoryDiv.offsetHeight;

  accessoryDiv.style.bottom = `${upBottom}px`;
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
