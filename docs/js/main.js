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

const bgRectangleClassName = 'cm-bgRectangle';

const bgRectEffect = {
  add: StateEffect.define({ from: 0, to: 0 }),
  remove: StateEffect.define({ from: 0, to: 0 }),
};

const bgRectangleField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(bgRectangles, tr) {
    bgRectangles = bgRectangles.map(tr.changes);
    for (const ef of tr.effects) {
      if (ef.is(bgRectEffect.add)) {
        bgRectangles = bgRectangles.update({
          add: [bgRectangleMark.range(ef.value.from, ef.value.to)],
        });
      } else if (ef.is(bgRectEffect.remove)) {
        bgRectangles = bgRectangles.update({
          // filter: (from, to, value) => {
          //   let shouldRemove =
          //     from === e.value.from &&
          //     to === e.value.to &&
          //     value.spec.class === bgRectangleClassName;
          //   return !shouldRemove;
          // },
          filter: (f, t, value) =>
          !(value.class === bgRectangleClassName),
        });
      }
    }
    return bgRectangles;
  },
  provide: (f) => EditorView.decorations.from(f),
});

const bgRectangleMark = Decoration.mark({ class: bgRectangleClassName });
const bgRectangleTheme = EditorView.baseTheme({
  '.cm-bgRectangle': { backgroundColor: '#23232380' },
});

function bgRectangleSet(view) {
  const { state, dispatch } = view;
  const { from, to } = state.selection.main.extend(0, state.doc.length);
  const decoSet = state.field(bgRectangleField, false);

  const addFromTO = (from, to) => bgRectEffect.add.of({ from, to });
  const removeFromTO = (from, to) => bgRectEffect.remove.of({ from, to });

  let effects = [];
  effects.push(
    !decoSet ? StateEffect.appendConfig.of([bgRectangleField]) : null,
  );
  decoSet?.between(from, to, (decoFrom, decoTo) => {
    if (from === decoTo || to === decoFrom) {
      return;
    }
    effects.push(removeFromTO(from, to));
    effects.push(removeFromTO(decoFrom, decoTo));
    effects.push(decoFrom < from ? addFromTO(decoFrom, from) : null);
    effects.push(decoTo > to ? addFromTO(to, decoTo) : null);
  });

  effects.push(addFromTO(from, to));

  if (!effects.length) {
    return false;
  }
  dispatch({ effects: effects.filter((ef) => ef) });
  return true;
}

const updateCallBack = EditorView.updateListener.of(
  (update) => update.docChanged && updateDocs(update),
);

function updateDocs(view) {
  bgRectangleSet(editor);
}

const resOutlineTheme = EditorView.baseTheme({
  '&.cm-editor': {
    '&.cm-focused': {
      outline: '0px dotted #212121',
    },
  },
});

const extensions = [
  ...initExtensions,
  resOutlineTheme,
  bgRectangleTheme,
  updateCallBack,
];
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

bgRectangleSet(editor);

