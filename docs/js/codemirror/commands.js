import { commands } from './codemirror.bundle.js';

export const {
  undo,
  redo,
  selectAll,
  selectLine,
  indentSelection,
  cursorLineUp,
  cursorLineDown,
  cursorCharLeft,
  cursorCharRight,
  toggleComment, } = commands;