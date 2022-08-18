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
  // darkBackground = '#21252b',
  // darkBackground = '#21252b44',
  darkBackground = '#2c313a88', // 元は、`highlightBackground` の色
  // highlightBackground = '#2c313a',
  // highlightBackground = '#2c313a88',
  highlightBackground = '#21252b44', // 元は、`darkBackground` の色
  // background = '#282c34',
  background = '#282c3400',
  guttersBakcground = '#282c3444',
  tooltipBackground = '#353a42',
  selection = '#3E4451',
  cursor = '#528bff'; // あお

/**
The editor theme styles for One Dark.
*/

const myOneDarkTheme = EditorView.theme(
  {
    '&': {
      color: ivory,
      backgroundColor: background,
      //fontSize: '0.8rem',
      fontSize: '0.9rem',
    },
    '.cm-scroller': {
      fontFamily:
        'Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace',
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
const myOneDarkHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: violet, backgroundColor: darkBackground },
  {
    tag: [
      tags.name,
      tags.deleted,
      tags.character,
      tags.propertyName,
      tags.macroName,
    ],
    color: coral,
    backgroundColor: darkBackground,
  },
  {
    tag: [tags.function(tags.variableName), tags.labelName],
    color: malibu,
    backgroundColor: darkBackground,
  },
  {
    tag: [tags.color, tags.constant(tags.name), tags.standard(tags.name)],
    color: whiskey,
    backgroundColor: darkBackground,
  },
  {
    tag: [tags.definition(tags.name), tags.separator],
    color: ivory,
    backgroundColor: darkBackground,
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
    backgroundColor: darkBackground,
  },
  {
    tag: [
      tags.operator,
      tags.operatorKeyword,
      tags.url,
      tags.escape,
      tags.regexp,
      tags.link,
      tags.special(tags.string),
    ],
    color: cyan,
    backgroundColor: darkBackground,
  },
  {
    tag: [tags.meta, tags.comment],
    color: stone,
    backgroundColor: darkBackground,
  },
  { tag: tags.strong, fontWeight: 'bold', backgroundColor: darkBackground },
  { tag: tags.emphasis, fontStyle: 'italic', backgroundColor: darkBackground },
  {
    tag: tags.strikethrough,
    textDecoration: 'line-through',
    backgroundColor: darkBackground,
  },
  {
    tag: tags.link,
    color: stone,
    textDecoration: 'underline',
    backgroundColor: darkBackground,
  },
  {
    tag: tags.heading,
    fontWeight: 'bold',
    color: coral,
    backgroundColor: darkBackground,
  },
  {
    tag: [tags.atom, tags.bool, /*@__PURE__*/ tags.special(tags.variableName)],
    color: whiskey,
    backgroundColor: darkBackground,
  },
  {
    tag: [tags.processingInstruction, tags.string, tags.inserted],
    color: sage,
    backgroundColor: darkBackground,
  },
  {
    tag: tags.invalid,
    color: invalid,
    backgroundColor: darkBackground,
  },
  {
    tag: [
      tags.lineComment,
      tags.blockComment,
      tags.docComment,
      tags.tagName,
      tags.attributeName,
      tags.literal,
      tags.docString,
      tags.attributeValue,
      tags.integer,
      tags.float,
      tags.null,
      tags.unit,
      tags.controlKeyword,
      tags.definitionKeyword,
      tags.moduleKeyword,
      tags.derefOperator,
      tags.arithmeticOperator,
      tags.logicOperator,
      tags.bitwiseOperator,
      tags.compareOperator,
      tags.updateOperator,
      tags.definitionOperator,
      tags.typeOperator,
      tags.controlOperator,
      tags.punctuation,
      tags.bracket,
      tags.angleBracket,
      tags.squareBracket,
      tags.paren,
      tags.brace,
      tags.content,
      tags.heading1,
      tags.heading2,
      tags.heading3,
      tags.heading4,
      tags.heading5,
      tags.heading6,
      tags.contentSeparator,
      tags.list,
      tags.quote,
      tags.monospace,
      tags.documentMeta,
      tags.local,
    ],
    backgroundColor: darkBackground,
  },
]);

/**
Extension to enable the One Dark theme (both the editor theme and
the highlight style).
*/
const myOneDark = [myOneDarkTheme, syntaxHighlighting(myOneDarkHighlightStyle)];

export { myOneDark, myOneDarkHighlightStyle, myOneDarkTheme };
