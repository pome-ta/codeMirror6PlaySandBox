import {EditorState,} from '@codemirror/state';
import {EditorView,} from '@codemirror/view';

import {javascript} from '@codemirror/lang-javascript';
//import {minimalSetup} from 'codemirror';
import {basicSetup} from 'codemirror';


const dummyCodePath = './dummyCode.js'

const getSource = async (path) => {
  const res = await fetch(path);
  const text = await res.text();
  return text;
};

const createEditor = (parent=null) => {
  const customTheme = EditorView.theme(
    {
      '&': {
        fontFamily: 'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
        fontSize: '0.72rem',
      },
    },
    {
      dark: false,
    },
  );
  
  const extensions = [
    basicSetup,
    //minimalSetup,
    customTheme,
    javascript(),
  ];
  
  const state = EditorState.create({
    extensions: extensions,
  });
  
  const view = new EditorView({
    state: state,
    parent: parent ? parent : document.body,
  });
  
  return view;
};



const editor = createEditor();

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded');
  getSource(dummyCodePath).then((res) => {
    editor.dispatch({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: res,
      },
    });
  });
});

