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
//import { oneDark } from '@codemirror/theme-one-dark';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';

import { oneDark } from './theme-my-oneDark.js';

const editorDiv = document.createElement('div');
editorDiv.id = 'editorWrap';
// editorDiv.style.background = 'lightslategray';
editorDiv.style.background = 'blue';
editorDiv.style.width = '100%';
//editorDiv.style.height = '100%';
document.body.appendChild(editorDiv);

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

import { Decoration } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { Facet } from '@codemirror/state';
import { ViewPlugin, ViewUpdate } from '@codemirror/view';

//!baseTheme
/*
const baseTheme = EditorView.baseTheme({
//const baseTheme = EditorView.theme({
  '&light .cm-zebraStripe': { backgroundColor: '#d4fafa' },
  '&dark .cm-zebraStripe': { backgroundColor: '#1a2727' },
});
*/

const baseTheme = EditorView.theme({
  '.cm-zebraStripe': { backgroundColor: '#d4fafa' },
  //'.cm-zebraStripe': { backgroundColor: '#1a2727' },
});

//!facet
const stepSize = Facet.define({
  combine: (values) => {
    return values.length ? Math.min(...values) : 2;
  },
});

function zebraStripes(options = {}) {
  //console.log(options.step == null ? [] : stepSize.of(options.step))
  return [
    baseTheme,
    //options.step == null ? [] : stepSize.of(options.step),
    showStripes,
  ];
}

//!stripeDeco
const stripe = Decoration.line({
  attributes: { class: 'cm-zebraStripe' },
});

function stripeDeco(view) {
  let step = view.state.facet(stepSize);
  let builder = new RangeSetBuilder();
  for (let { from, to } of view.visibleRanges) {
    for (let pos = from; pos <= to; ) {
      let line = view.state.doc.lineAt(pos);
      if (line.number % step == 0) builder.add(line.from, line.from, stripe);
      pos = line.to + 1;
    }
  }
  return builder.finish();
}

//!showStripes
const showStripes = ViewPlugin.fromClass(
  class {
    constructor(view) {
      // EditorView
      this.decorations = stripeDeco(view);
    }

    update(update) {
      if (update.docChanged || update.viewportChanged)
        this.decorations = stripeDeco(update.view);
    }
  },
  {
    decorations: (v) => v.decorations,
  }
);

const u00b7 = '·'; // ラテン語中点
const u2018 = '∘'; // RING OPERATOR
const u2022 = '•'; // bullet
const u2023 = '‣'; // triangular bullet
const u2219 = '∙'; // BULLET OPERATOR
const u22c5 = '⋅'; // DOT OPERATOR
const uff65 = '･'; // 半角中点

const whitespaceShow = highlightSpecialChars({
  render: (code) => {
    console.log(code)
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
    //oneDark, // theme
    // indentationMarkers(),
    whitespaceShow,
    //!example
    zebraStripes(),
  ],
});

const editor = new EditorView({
  state,
  parent: editorDiv,
});
