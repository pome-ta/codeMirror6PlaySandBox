import { minimalSetup } from './codemirror/codemirror.js';
import { EditorState, } from './codemirror/state.js';
import { EditorView, lineNumbers } from './codemirror/view.js';


class Editor {
  constructor(editorDiv, doc = '') {
    this.state = EditorState.create({
      doc: doc,
      extensions: [minimalSetup, lineNumbers()]
    });
    this.editor = new EditorView({
      state: this.state,
      parent: editorDiv,
    })
  }
}

export default Editor;