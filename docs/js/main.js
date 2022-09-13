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
/*
const addBackgroundLine = StateEffect.define({
  map: ({ from, to }, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to),
  }),
});
*/
const addBackgroundLine = StateEffect.define({ from: 0, to: 0 });
/*
const effectBackgroundLine = StateEffect.define({
  map: ({ from, to }, change) => ({
    from: change.mapPos(from),
    to: change.mapPos(to),
  }),
});
*/

const effectBackgroundLine = StateEffect.define({ from: 0, to: 0 });

const sEffect = {
  add: StateEffect.define({ from: 0, to: 0 }),
  remove: StateEffect.define({ from: 0, to: 0 }),
};

/*
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
  provide: (f) => {
    //console.log(f)
    return EditorView.decorations.from(f)
  },
});
*/
const backgroundlineField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(backgroundlines, tr) {
    backgroundlines = backgroundlines.map(tr.changes);
    for (let e of tr.effects) {
      if (e.is(sEffect.add)) {
        backgroundlines = backgroundlines.update({
          add: [backgroundlineMark.range(e.value.from, e.value.to)],
        });
      } else if (e.is(sEffect.remove)) {
        backgroundlines = backgroundlines.update({
          filter: (from, to, value) => {
            let shouldRemove =
              from === e.value.from &&
              to === e.value.to &&
              value.spec.class === 'cm-backgroundline';
            return !shouldRemove;
          },
        });
      }
    }
    return backgroundlines;
  },
  provide: (f) => {
    //console.log(f)
    return EditorView.decorations.from(f);
  },
});

const backgroundlineMark = Decoration.mark({ class: 'cm-backgroundline' });

const backgroundlineTheme = EditorView.baseTheme({
  '.cm-backgroundline': { backgroundColor: '#23232380' },
});

function backgroundlineSelection(view) {
  //console.log(view);
  const decoSet = view.state.field(backgroundlineField, false);
  let effects = [];

  if (!decoSet) {
    effects.push(
      StateEffect.appendConfig.of([backgroundlineField, backgroundlineTheme])
    );
  }

  view.state.selection.ranges
    .filter((r) => !r.empty)
    .forEach(({ from, to }) => {
      effects.push(sEffect.add.of({ from, to }));
      decoSet?.between(from, to, (decoFrom, decoTo) => {
        if (from === decoTo || to === decoFrom) {
          return;
        }
        effects.push(sEffect.remove.of({ from, to }));
        effects.push(sEffect.remove.of({ from: decoFrom, to: decoTo }));
        if (decoFrom < from) {
          effects.push(sEffect.add.of({ from: decoFrom, to: from }));
        }
        if (decoTo > to) {
          effects.push(Effect.add.of({ from: to, to: decoTo }));
        }
      });
    });

  if (!effects.length) {
    return false;
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

const resOutlineTheme = EditorView.baseTheme({
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
//const extensions = [...initExtensions];
//const extensions = [...initExtensions, backgroundlineKeymap];
// const extensions = [...initExtensions, updateCallBack];
//const extensions = [...initExtensions, underlineKeymap, updateCallBack];
const extensions = [...initExtensions, resOutlineTheme, backgroundlineKeymap];
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
backgroundlineSelection(editor);
/*
btn.addEventListener('click', () => {
  btn.style.height = '4rem';
  //console.log(editor)
  backgroundlineSelection(editor);
});
*/
//underlineSelection(editor)
