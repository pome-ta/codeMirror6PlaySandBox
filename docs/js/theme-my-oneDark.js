import { EditorView } from '@codemirror/view';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Using https://github.com/one-dark/vscode-one-dark-theme/ as reference for the colors
const chalky = '#e5c07b', // ゴールドぽい
  coral = '#e06c75', // ピンクっぽい
  cyan = '#56b6c2', // シアン、水色系
  invalid = '#ffffff', // 白
  ivory = '#abb2bf', // 灰色
  stone = '#7d8799', // Brightened compared to original to increase contrast  // 濃い灰色
  malibu = '#61afef', // 水色
  sage = '#98c379', // 緑
  whiskey = '#d19a66', // オレンジ
  violet = '#c678dd', // ピンク
  //darkBackground = '#21252b',
  darkBackground = '#21252b88',
  //highlightBackground = '#2c313a',
  highlightBackground = '#2c313a88',
  //background = '#282c34',
  background = '#282c3400',
  tooltipBackground = '#353a42',
  selection = '#3E4451',
  cursor = '#528bff'; // あお
/**
The editor theme styles for One Dark.
*/
const oneDarkTheme = /*@__PURE__*/ EditorView.theme(
  {
    '&.cm-editor': {
      fontSize: '0.8rem',
    },
    '.cm-line': {
      // display: 'inline-block',
      // display: 'table-row-group',
      // backgroundColor: darkBackground,
    },
    '.cm-line *': {
      // backgroundColor: 'red',
      // backgroundColor: darkBackground,
    },

    '.cm-scroller': {
      fontFamily:
        'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
    },
    '&': {
      color: ivory,
      backgroundColor: background,
    },
    '.cm-content': {
      caretColor: cursor,
    },
    '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor },
    '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection':
      { backgroundColor: selection },

    '.cm-panels': { backgroundColor: darkBackground, color: ivory },
    '.cm-panels.cm-panels-top': { borderBottom: '2px solid black' },
    '.cm-panels.cm-panels-bottom': { borderTop: '2px solid black' },
    '.cm-searchMatch': {
      backgroundColor: '#72a1ff59',
      outline: '1px solid #457dff',
    },
    '.cm-searchMatch.cm-searchMatch-selected': {
      backgroundColor: '#6199ff2f',
    },
    '.cm-activeLine': { backgroundColor: highlightBackground },
    '.cm-selectionMatch': { backgroundColor: '#aafe661a' },
    '&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket': {
      backgroundColor: '#bad0f847',
      outline: '1px solid #515a6b',
    },
    '.cm-gutters': {
      backgroundColor: background,
      color: stone,
      border: 'none',
    },
    '.cm-activeLineGutter': {
      backgroundColor: highlightBackground,
    },
    '.cm-foldPlaceholder': {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ddd',
    },
    '.cm-tooltip': {
      border: 'none',
      backgroundColor: tooltipBackground,
    },
    '.cm-tooltip .cm-tooltip-arrow:before': {
      borderTopColor: 'transparent',
      borderBottomColor: 'transparent',
    },
    '.cm-tooltip .cm-tooltip-arrow:after': {
      borderTopColor: tooltipBackground,
      borderBottomColor: tooltipBackground,
    },
    '.cm-tooltip-autocomplete': {
      '& > ul > li[aria-selected]': {
        backgroundColor: highlightBackground,
        color: ivory,
      },
    },
  },
  { dark: true }
);
/**
The highlighting style for code in the One Dark theme.
*/
const oneDarkHighlightStyle = /*@__PURE__*/ HighlightStyle.define([
  { tag: tags.keyword, color: violet },
  {
    tag: [
      tags.name,
      tags.deleted,
      tags.character,
      tags.propertyName,
      tags.macroName,
    ],
    color: coral,
  },
  {
    tag: [/*@__PURE__*/ tags.function(tags.variableName), tags.labelName],
    color: malibu,
  },
  {
    tag: [
      tags.color,
      /*@__PURE__*/ tags.constant(tags.name),
      /*@__PURE__*/ tags.standard(tags.name),
    ],
    color: whiskey,
  },
  {
    tag: [/*@__PURE__*/ tags.definition(tags.name), tags.separator],
    color: ivory,
  },
  {
    tag: [
      tags.typeName,
      tags.className,
      tags.number,
      tags.changed,
      tags.annotation,
      tags.modifier,
      tags.self,
      tags.namespace,
    ],
    color: chalky,
  },
  {
    tag: [
      tags.operator,
      tags.operatorKeyword,
      tags.url,
      tags.escape,
      tags.regexp,
      tags.link,
      /*@__PURE__*/ tags.special(tags.string),
    ],
    color: cyan,
  },
  { tag: [tags.meta, tags.comment], color: stone },
  { tag: tags.strong, fontWeight: 'bold' },
  { tag: tags.emphasis, fontStyle: 'italic' },
  { tag: tags.strikethrough, textDecoration: 'line-through' },
  { tag: tags.link, color: stone, textDecoration: 'underline' },
  { tag: tags.heading, fontWeight: 'bold', color: coral },
  {
    tag: [tags.atom, tags.bool, /*@__PURE__*/ tags.special(tags.variableName)],
    color: whiskey,
  },
  {
    tag: [tags.processingInstruction, tags.string, tags.inserted],
    color: sage,
  },
  { tag: tags.invalid, color: invalid },
]);
/**
Extension to enable the One Dark theme (both the editor theme and
the highlight style).
*/
const oneDark = [
  oneDarkTheme,
  /*@__PURE__*/ syntaxHighlighting(oneDarkHighlightStyle),
];

export { oneDark, oneDarkHighlightStyle, oneDarkTheme };
