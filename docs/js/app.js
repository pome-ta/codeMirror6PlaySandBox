import { EditorView } from 'codemirror';
import { basicSetup, minimalSetup } from 'codemirror';

import { EditorState, Compartment } from '@codemirror/state';

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

//import { oneDark } from '@codemirror/theme-one-dark';
import { myOneDark } from './theme-my-oneDark.js';

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
editorDiv.style.background = 'blue';
editorDiv.style.width = '100%';
document.body.appendChild(editorDiv);

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

/*
const codeSample = `#version 300 es
precision highp float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

out vec4 fragmentColor;

struct Ray{
  vec3 origin;
  vec3 direction;
};

void main(void) {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  Ray ray;
  ray.origin = vec3(0.0, 0.0, 5.0);
  ray.direction = normalize(vec3(p.x, p.y, -1.0));

  fragmentColor = vec4(ray.direction, 1.0);
}
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
const whitespaceShow = highlightSpecialChars({
  render: (code) => {
    let node = document.createElement('span');
    node.classList.add('cm-whoteSpace');
    // node.style.opacity = 0.5;
    node.style.color = ivory;
    //node.innerText = u22c5;
    node.innerText = uff65;
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

const tabSize = new Compartment();

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
    //highlightSelectionMatches(),
    closeBrackets(),
    autocompletion(),
    keymap.of([...closeBracketsKeymap, ...completionKeymap, indentWithTab]),
    /* --- basicSetup */
    tabSize.of(EditorState.tabSize.of(2)),
    EditorView.lineWrapping, // 改行
    javascript(),
    myOneDark, // theme
    backgroundOpacity,
    whitespaceShow,
  ],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});
