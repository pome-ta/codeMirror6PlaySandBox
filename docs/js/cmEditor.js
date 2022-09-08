import { EditorView, minimalSetup } from 'codemirror';

import { EditorState } from '@codemirror/state';
import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightActiveLine,
} from '@codemirror/view';

import { Decoration } from '@codemirror/view';
import { StateField, StateEffect } from '@codemirror/state';

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

const underlineTheme = EditorView.baseTheme({
  '.cm-underline': { textDecoration: 'underline 3px red' },
});

function underlineSelection(view) {
  // console.log(view);
  let effects = view.state.selection.ranges
    .filter((r) => !r.empty)
    .map(({ from, to }) => addUnderLine.of({ from, to }));
  if (!effects.length) {
    return false;
  }
  if (!view.state.field(underlineField, false)) {
    effects.push(StateEffect.appendConfig.of([underlineField, underlineTheme]));
  }
  view.dispatch({ effects });
  return true;
}

import { keymap } from '@codemirror/view';
const underlineKeymap = keymap.of([
  {
    key: 'Mod-b',
    preventDefault: true,
    run: underlineSelection,
  },
]);

const editorDiv = document.createElement('div');
editorDiv.id = 'editor-div';
editorDiv.style.width = '100%';

let myTheme = EditorView.theme({
  '&': {
    fontSize: '0.8rem',
  },
  '.cm-scroller': {
    fontFamily:
      'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
  },
});

const initExtensions = [
  minimalSetup,
  lineNumbers(),
  highlightActiveLineGutter(),
  highlightActiveLine(),
  EditorView.lineWrapping, // 改行
  underlineKeymap,
  myTheme,
];

export { EditorView, EditorState, initExtensions, editorDiv };
