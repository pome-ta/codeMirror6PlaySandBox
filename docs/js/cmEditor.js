import { EditorView, minimalSetup } from 'codemirror';

import { EditorState } from '@codemirror/state';
import {
  lineNumbers,
  highlightActiveLineGutter,
  highlightActiveLine,
} from '@codemirror/view';

import { EditorSelection } from '@codemirror/state';
import { Decoration } from '@codemirror/view';
import { StateField, StateEffect } from '@codemirror/state';

import { keymap } from '@codemirror/view';
// const underlineKeymap = keymap.of([
//   {
//     key: 'Mod-b',
//     preventDefault: true,
//     run: underlineSelection,
//   },
// ]);

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
  myTheme,
];

export {
  EditorView,
  EditorState,
  EditorSelection,
  keymap,
  StateEffect,
  StateField,
  Decoration,
  initExtensions,
  editorDiv,
};
