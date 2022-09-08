import {
  EditorView,
  EditorState,
  EditorSelection,
  keymap,
  StateEffect,
  StateField,
  Decoration,
  initExtensions,
  editorDiv,
} from './modules/cmEditor.bundle.js';

/* -- main */
const container = document.createElement('main');
container.id = 'container-main';
container.style.height = '100%';

const btn = document.createElement('div');
btn.textContent = 'underline';
btn.style.height = '3rem';

container.appendChild(btn);
document.body.appendChild(container).appendChild(editorDiv);

const addUnderLine = StateEffect.define({
  map: ({ from, to }, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to),
  }),
});

const underlineField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(underlines, tr) {
    //console.log(underlines);
    underlines = underlines.map(tr.changes);
    for (let e of tr.effects)
      if (e.is(addUnderLine)) {
        underlines = underlines.update({
          add: [underlineMark.range(e.value.from, e.value.to)],
        });
      }
    return underlines;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const underlineMark = Decoration.mark({ class: 'cm-underline' });
/*
const underlineTheme = EditorView.baseTheme({
  '.cm-underline': { textDecoration: 'underline 3px red' },
});
*/

const underlineTheme = EditorView.baseTheme({
  '.cm-underline': { fontSize: '2rem' },
});

function underlineSelection(view) {
  //console.log(view);
  const endRange = view.state.doc.length;
  const ranges = [EditorSelection.range(0, endRange)];
  let effects = ranges
    .filter((r) => !r.empty)
    .map(({ from, to }) => addUnderLine.of({ from, to }));
  console.log(effects)
  if (!effects.length) {
    return false;
  }
  /*
  let effects = view.state.selection.ranges
    .filter((r) => !r.empty)
    .map(({ from, to }) => addUnderLine.of({ from, to }));
  */
  if (!view.state.field(underlineField, false)) {
    effects.push(StateEffect.appendConfig.of([underlineField, underlineTheme]));
  }
  view.dispatch({ effects });
  return true;
}

const underlineKeymap = keymap.of([
  {
    key: 'b',
    preventDefault: true,
    run: underlineSelection,
  },
]);
/*
const updateCallBack = EditorView.updateListener.of(
  (update) => update.docChanged && upup(update)
);

function upup(view) {
  //console.log('hoge');
  //console.log(view);
  view;
}
*/
//const extensions = [...initExtensions];
const extensions = [...initExtensions, underlineKeymap];
// const extensions = [...initExtensions, updateCallBack];
//const extensions = [...initExtensions, underlineKeymap, updateCallBack];
const docText = `hoge fuga あああああ
ほげほげ、ふががう
hoge i0oialuwOlL1
`;

const state = EditorState.create({
  doc: docText,
  extensions: extensions,
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

underlineSelection(editor)

btn.addEventListener('click', () => {
  btn.style.height = '4rem';
  //console.log(editor)
  underlineSelection(editor)
});

//underlineSelection(editor)
