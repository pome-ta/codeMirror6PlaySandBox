import { EditorView } from 'codemirror';
import { basicSetup, minimalSetup } from 'codemirror';

import { EditorState } from '@codemirror/state';

import {
  lineNumbers,
  highlightActiveLineGutter,
  dropCursor,
  highlightActiveLine,
  keymap,
  highlightSpecialChars,
} from '@codemirror/view';
import { indentOnInput, bracketMatching } from '@codemirror/language';
import { highlightSelectionMatches } from '@codemirror/search';
import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';

import { undo, redo, indentWithTab } from '@codemirror/commands';


import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
editorDiv.style.width = '100%';
//editorDiv.style.height = '100%';
document.body.appendChild(editorDiv);

const codeSample = `function initShader() {
  gl = cxtCanvas.getContext('webgl2');
  //gl = cxtCanvas.getContext('webgl');
  const prg = create_program(
    create_shader('vs', vertexPrimitive),
    create_shader('fs', fragmentPrimitive)
  );
  uniLocation[0] = gl.getUniformLocation(prg, 'time');
  uniLocation[1] = gl.getUniformLocation(prg, 'mouse');
  uniLocation[2] = gl.getUniformLocation(prg, 'resolution');

  const position = new Float32Array([
    -1.0, 1.0, 0.0, 1.0, 1.0, 0.0, -1.0, -1.0, 0.0, 1.0, -1.0, 0.0,
  ]);
  const index = new Uint16Array([0, 2, 1, 1, 2, 3]);

  const vPosition = create_vbo(position);
  const vIndex = create_ibo(index);
  const vAttLocation = gl.getAttribLocation(prg, 'vertexPosition');

  const VERTEX_SIZE = 3; // vec3

  gl.bindBuffer(gl.ARRAY_BUFFER, vPosition);
  gl.enableVertexAttribArray(vAttLocation);
  gl.vertexAttribPointer(vAttLocation, VERTEX_SIZE, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

// シェーダを生成する関数
function create_shader(type, text) {
  let shader;
  // scriptタグのtype属性をチェック
  switch (type) {
    // 頂点シェーダの場合
    case 'vs':
      shader = gl.createShader(gl.VERTEX_SHADER);
      break;
    // フラグメントシェーダの場合
    case 'fs':
      shader = gl.createShader(gl.FRAGMENT_SHADER);
      break;
    default:
      return;
  }

  // 生成されたシェーダにソースを割り当てる
  gl.shaderSource(shader, text);
  // シェーダをコンパイルする
  gl.compileShader(shader);
  // シェーダが正しくコンパイルされたかチェック
  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // 成功していたらシェーダを返して終了
    return shader;
  } else {
    // 失敗していたらエラーログをアラートしコンソールに出力
    // alert(gl.getShaderInfoLog(shader));
    console.log(gl.getShaderInfoLog(shader));
  }
}
`;

const myTheme = EditorView.baseTheme({
  '&.cm-editor': {
    fontSize: '0.8rem',
  },
  '.cm-scroller': {
    fontFamily:
      'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
  },
});


const u00b7 = '·'; // ラテン語中点
const u2018 = '∘'; // RING OPERATOR
const u2022 = '•'; // bullet
const u2023 = '‣'; // triangular bullet
const u2219 = '∙'; // BULLET OPERATOR
const u22c5 = '⋅'; // DOT OPERATOR
const uff65 = '･'; // 半角中点

const whitespaceShow = highlightSpecialChars({
  render: (code) => {
    let node = document.createElement('span');
    node.style.opacity = 0.5;
    node.innerText = u22c5;
    node.title = '\\u' + code.toString(16);
    return node;
  },
  specialChars: /\x20/g,
});

const state = EditorState.create({
  doc: codeSample,
  extensions: [
    minimalSetup,
    /* diff basicSetup */
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    dropCursor(),
    indentOnInput(),
    bracketMatching(),
    highlightSelectionMatches(),
    closeBrackets(),
    autocompletion(),
    keymap.of([...closeBracketsKeymap, ...completionKeymap, indentWithTab]),
    /* --- basicSetup */
    //tabSize.of(EditorState.tabSize.of(4)),
    EditorView.lineWrapping, // 改行
    javascript(),
    oneDark, // theme
    myTheme, // custom
    // indentationMarkers(),
    whitespaceShow,
  ],
});




const editor = new EditorView({
  state,
  parent: editorDiv,
});
