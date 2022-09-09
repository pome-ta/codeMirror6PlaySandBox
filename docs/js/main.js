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
container.style.backgroundColor = 'red';
/*
const btn = document.createElement('div');
btn.textContent = 'underline';
btn.style.height = '3rem';

container.appendChild(btn);
*/
document.body.appendChild(container).appendChild(editorDiv);

const addBackgroundLine = StateEffect.define({
  map: ({ from, to }, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to),
  }),
});

const backgroundlineField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(backgroundlines, tr) {
    //console.log(underlines);
    backgroundlines = backgroundlines.map(tr.changes);
    for (let e of tr.effects)
      if (e.is(addBackgroundLine)) {
        backgroundlines = backgroundlines.update({
          add: [backgroundlineMark.range(e.value.from, e.value.to)],
        });
      }
    return backgroundlines;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const backgroundlineMark = Decoration.mark({ class: 'cm-backgroundline' });
/*
const underlineTheme = EditorView.baseTheme({
  '.cm-underline': { textDecoration: 'underline 3px red' },
});
*/

const backgroundlineTheme = EditorView.baseTheme({
  //'.cm-backgroundline': { textDecoration: 'underline 8px red' },
  //'.cm-backgroundline': { fontSize: '2rem' },
  '.cm-backgroundline': { backgroundColor: '#23232380' },
  '&.cm-editor': {
    '&.cm-focused': {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: '0px dotted #212121',
    },
  },
});

function backgroundlineSelection(view) {
  //console.log(view);
  const endRange = view.state.doc.length;
  const ranges = [EditorSelection.range(0, endRange)];
  let effects = ranges
    .filter((r) => !r.empty)
    .map(({ from, to }) => addBackgroundLine.of({ from, to }));
  //console.log(effects);
  if (!effects.length) {
    return false;
  }
  /*
  let effects = view.state.selection.ranges
    .filter((r) => !r.empty)
    .map(({ from, to }) => addUnderLine.of({ from, to }));
  */
  if (!view.state.field(backgroundlineField, false)) {
    effects.push(
      StateEffect.appendConfig.of([backgroundlineField, backgroundlineTheme])
    );
  }
  view.dispatch({ effects });
  return true;
}

const backgroundlineKeymap = keymap.of([
  {
    key: 'b',
    preventDefault: true,
    run: backgroundlineSelection,
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
const extensions = [...initExtensions];
//const extensions = [...initExtensions, backgroundlineKeymap];
// const extensions = [...initExtensions, updateCallBack];
//const extensions = [...initExtensions, underlineKeymap, updateCallBack];
const docText = `hoge fuga あああああ
ほげほげ、ふががう
hoge i0oialuwOlL1`;

const state = EditorState.create({
  doc: docText,
  extensions: extensions,
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

backgroundlineSelection(editor);
/*
btn.addEventListener('click', () => {
  btn.style.height = '4rem';
  //console.log(editor)
  backgroundlineSelection(editor);
});
*/
//underlineSelection(editor)
