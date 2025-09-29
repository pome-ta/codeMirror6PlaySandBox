import {EditorState,} from '@codemirror/state';
import {EditorView} from '@codemirror/view';

import {languageServerExtensions, LSPClient} from '@codemirror/lsp-client';
import {typescriptLanguage} from '@codemirror/lang-javascript';


//import {minimalSetup} from 'codemirror';
import {basicSetup} from 'codemirror';

import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from '@typescript/vfs';
import ts from 'typescript';


//const defaultMap = await createDefaultMapFromCDN({ target: ts.ScriptTarget.ES2022 }, ts.version, /* includeLibs */ true, ts);
//console.log(defaultMap)

const vfsInit = async ()=> {
  const defaultMap = await createDefaultMapFromCDN({ target: ts.ScriptTarget.ES2022 }, ts.version, /* includeLibs */ true, ts);
  const system = createSystem(defaultMap);
  const env = createVirtualTypeScriptEnvironment(system, [], ts, { allowJs: true });
  //console.log(ts.ScriptTarget.ES2022)
  console.log(env)

}

vfsInit()
const dummyCodePath = './dummyCode.js';

const getSource = async (path) => {
  const res = await fetch(path);
  const text = await res.text();
  return text;
};



const createEditor = (parent = null) => {
  const customTheme = EditorView.theme(
    {
      '&': {
        fontFamily: 'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
        fontSize: '0.72rem',
      },
    },
    { dark: false, },
  );

  const extensions = [
    basicSetup,
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

