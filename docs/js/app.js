import { EditorView } from 'codemirror';
import { basicSetup, minimalSetup } from 'codemirror';

import { EditorState, EditorSelection, Compartment } from '@codemirror/state';

import {
  lineNumbers,
  highlightActiveLineGutter,
  dropCursor,
  highlightActiveLine,
  keymap,
  highlightSpecialChars,
} from '@codemirror/view';

//import { highlightSelectionMatches } from '@codemirror/search';

import {
  closeBrackets,
  autocompletion,
  closeBracketsKeymap,
  completionKeymap,
} from '@codemirror/autocomplete';

import { indentOnInput, bracketMatching } from '@codemirror/language';

import { undo, redo, indentWithTab } from '@codemirror/commands';

import { javascript } from '@codemirror/lang-javascript';

import { oneDark } from '@codemirror/theme-one-dark';
import { myOneDark } from './theme-my-oneDark.js';

const vertexPrimitive = `#version 300 es
precision highp float;

in vec3 vertexPosition;

void main(void){
    gl_Position = vec4(vertexPosition, 1.0);
}
`;

let fragmentPrimitive = `#version 300 es
precision highp float;
/* よくあるやつ */

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

out vec4 fragmentColor;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;

  vec3 outColor = vec3(uv, abs(sin(time)));
  fragmentColor = vec4(outColor, 1.0);
}`;

let canvasDiv, cxtCanvas;
let gl;
let uniLocation = new Array();

let mouseX = 0.5;
let mouseY = 0.5;
let canvasW, canvasH;

let isPlaying = 1;
const switchPlayPause = ['Play', 'Pause'];
let playPauseButton;

let time = 0.0;
const FPS = 120;
const frameTime = 1 / FPS;
let prevTimestamp = 0;

function createCanvas() {
  document.body.style.backgroundColor = '#232323';
  canvasDiv = document.createElement('div');
  cxtCanvas = document.createElement('canvas');
  canvasDiv.appendChild(cxtCanvas);
  document.body.appendChild(canvasDiv);
  canvasDiv.style.width = '100%';
  canvasDiv.style.height = '100%';
  canvasDiv.style.position = 'fixed';
  canvasDiv.style.top = 0;
  canvasDiv.style.left = 0;
  canvasDiv.style.zIndex = 0;

  cxtCanvas.style.width = '100%';
}

function initCanvasSize() {
  // const oneSide = Math.min(canvasDiv.clientWidth, canvasDiv.clientHeight);
  // const oneSide = canvasDiv.clientWidth;
  // cxtCanvas.width = oneSide;
  // cxtCanvas.height = oneSide;
  cxtCanvas.width = canvasDiv.clientWidth;
  cxtCanvas.height = canvasDiv.clientHeight;
  canvasW = cxtCanvas.width;
  canvasH = cxtCanvas.height;
}

function initShader() {
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

  gl.viewport(0, 0, canvasW, canvasH);

  gl.bindBuffer(gl.ARRAY_BUFFER, vPosition);
  gl.enableVertexAttribArray(vAttLocation);
  gl.vertexAttribPointer(vAttLocation, VERTEX_SIZE, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vIndex);

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
}

function upRender() {
  initCanvasSize();
  gl.viewport(0, 0, canvasW, canvasH);
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
    // console.log(gl.getShaderInfoLog(shader));
  }
}

// プログラムオブジェクトを生成しシェーダをリンクする関数
function create_program(vs, fs) {
  // プログラムオブジェクトの生成
  const program = gl.createProgram();
  if (!program) {
    return null;
  }
  // プログラムオブジェクトにシェーダを割り当てる
  gl.attachShader(program, vs);
  gl.deleteShader(vs);
  gl.attachShader(program, fs);
  gl.deleteShader(fs);
  // シェーダをリンク
  gl.linkProgram(program);
  // シェーダのリンクが正しく行なわれたかチェック
  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    // 成功していたらプログラムオブジェクトを有効にする
    gl.useProgram(program);
    // プログラムオブジェクトを返して終了
    return program;
  } else {
    // 失敗していたら NULL を返す
    return null;
  }
}

// VBOを生成する関数
function create_vbo(data) {
  // バッファオブジェクトの生成
  const vbo = gl.createBuffer();
  // バッファをバインドする
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  // バッファにデータをセット
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // バッファのバインドを無効化
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  // 生成した VBO を返して終了
  return vbo;
}

// IBOを生成する関数
function create_ibo(data) {
  // バッファオブジェクトの生成
  const ibo = gl.createBuffer();
  // バッファをバインドする
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);
  // バッファにデータをセット
  // gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Int16Array(data), gl.STATIC_DRAW);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // バッファのバインドを無効化
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  // 生成したIBOを返して終了
  return ibo;
}

function glRender(time) {
  // カラーバッファをクリア
  gl.clear(gl.COLOR_BUFFER_BIT);
  // uniform 関連
  gl.uniform1f(uniLocation[0], time);
  gl.uniform2fv(uniLocation[1], [mouseX, mouseY]);
  gl.uniform2fv(uniLocation[2], [canvasW, canvasH]);
  // 描画
  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
  gl.flush();
}

function loop(timestamp) {
  const elapsed = (timestamp - prevTimestamp) / 1000;
  if (elapsed <= frameTime) {
    requestAnimationFrame(loop);
    return;
  }
  prevTimestamp = timestamp;

  if (!isPlaying) {
    requestAnimationFrame(loop);
    return;
  }

  time += frameTime;
  glRender(time);
  // 再帰
  requestAnimationFrame(loop);
}

createCanvas();
initCanvasSize();
initShader();
glRender(time);
loop();

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
// editorDiv.style.background = 'blue';
// editorDiv.style.background = 'slategray';
editorDiv.style.width = '100%';
/*
editorDiv.style.position = 'relative';
editorDiv.style.zIndex = 2;
editorDiv.style.top = 0;*/
//document.body.appendChild(editorDiv);

/*
const codeSample = `const whitespaceShow = highlightSpecialChars({
  render: (code) => {
    let node = document.createElement('span');
    node.style.opacity = 0.5;
    node.innerText = u22c5;
    node.title = '\\u' + code.toString(16);
    // return node;
    return document.createTextNode(String.fromCodePoint(code));
  },
  // specialChars: /\x20/g,
  addSpecialChars: /\x20/g,
});
`;
*/

const u00b7 = '·'; // ラテン語中点
const u2018 = '∘'; // RING OPERATOR
const u2022 = '•'; // bullet
const u2023 = '‣'; // triangular bullet
const u2219 = '∙'; // BULLET OPERATOR
const u22c5 = '⋅'; // DOT OPERATOR
const uff65 = '･'; // 半角中点

const ivory = '#abb2bf44'; // todo: oneDark から拝借
const stone = '#7d8799'; // Brightened compared to original to increase contrast  // 濃い灰色
const whitespaceShow = highlightSpecialChars({
  render: (code) => {
    let node = document.createElement('span');
    node.classList.add('cm-whoteSpace');
    // node.style.opacity = 0.5;
    node.style.color = ivory;
    // node.style.color = stone;
    node.innerText = u22c5;
    // node.innerText = uff65;
    node.title = '\\u' + code.toString(16);
    return node;
  },
  // specialChars: /\x20/g,
  addSpecialChars: /\x20/g,
});

const darkBackground = '#21252b44';
const backgroundOpacity = EditorView.theme({
  '.cm-line': { padding: 0 },
  '.cm-line *': { backgroundColor: darkBackground },
});

const overflowView = EditorView.theme({
  '&': { maxHeight: `${visualViewport.height}`, fontSize: '1.0rem' },
  '.cm-gutter,.cm-content': { minHeight: `${visualViewport.height}` },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily:
      'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
  },
});

const tabSize = new Compartment();

const updateCallback = EditorView.updateListener.of(
  (update) => update.docChanged && onChange(update.state.doc.toString())
);

const state = EditorState.create({
  doc: fragmentPrimitive,
  extensions: [
    minimalSetup,
    /* diff basicSetup */
    lineNumbers(),
    highlightActiveLineGutter(),
    highlightActiveLine(),
    dropCursor(),
    indentOnInput(),
    bracketMatching(),
    //highlightSelectionMatches(),
    closeBrackets(),
    autocompletion(),
    keymap.of([...closeBracketsKeymap, ...completionKeymap, indentWithTab]),
    /* --- basicSetup */
    tabSize.of(EditorState.tabSize.of(2)),
    EditorView.lineWrapping, // 改行
    javascript(),
    myOneDark, // theme
    // oneDark,
    backgroundOpacity,
    whitespaceShow,
    // todo: コピーで2重に取得しちゃう
    // EditorView.updateListener.of((v) => {
    //   if (v.docChanged) {
    //     updateLog(v.state.doc.toString());
    //     v.des
    //   }
    // }),
    updateCallback,
    overflowView,
  ],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});

function onChange(docs) {
  fragmentPrimitive = docs;
  try {
    initShader();
  } catch {}
  // editor.destroy();
}

window.addEventListener('resize', upRender);

export { editor, editorDiv, undo, redo, EditorSelection };
