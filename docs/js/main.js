import {EditorState,} from '@codemirror/state';
import {EditorView,} from '@codemirror/view';

import {LSPClient, languageServerExtensions} from '@codemirror/lsp-client';
import {typescriptLanguage} from '@codemirror/lang-javascript';




//import {minimalSetup} from 'codemirror';
import {basicSetup} from 'codemirror';


const dummyCodePath = './dummyCode.js'

const getSource = async (path) => {
  const res = await fetch(path);
  const text = await res.text();
  return text;
};

/*
function simpleWebSocketTransport(uri) {
  let handlers = [];
  let sock = new WebSocket(uri);
  sock.onmessage = e => { for (let h of handlers) h(e.data.toString()) }
  return new Promise(resolve => {
    sock.onopen = () => resolve({
      send(message) { sock.send(message) },
      subscribe((value) => void) { handlers.push(handler) },
      unsubscribe(handler: (value: string) => void) { handlers = handlers.filter(h => h != handler) }
    })
  })
}
*/

let transport = await simpleWebSocketTransport("ws://host:port")
let client = new LSPClient({extensions: languageServerExtensions()}).connect(transport)





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
    typescriptLanguage,
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

