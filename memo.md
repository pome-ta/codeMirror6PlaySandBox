# ๐ 2022/12/31

ใจใใใใupdate

ไฝใใใใใจใใฆใใใใใ่ฆใใฆใใชใๆใใงใใ

ๅทฎๅ็ใช็ขบ่ชใจใใใงใใใจใใใใใใใ

# ๐ 2022/10/21

ใซใธใฅใขใซใซcodemirror ใฎupdate ใใใฆใฟใฆใใ

# ๐ 2022/10/15

ๅบงๅธๅฃใ้ฉๅฎ`span` ใซใชใฃใฆใใใฎใงใใใๆใใซใใใ

# ๐ 2022/09/12

## ๅบงๅธๅฃ

ๆดๆฐใใใใ

[How to remove a decoration mark from state - discuss.CodeMirror](https://discuss.codemirror.net/t/how-to-remove-a-decoration-mark-from-state/3809)

[How to check if a selection contains a mark decoration? - v6 - discuss.CodeMirror](https://discuss.codemirror.net/t/how-to-check-if-a-selection-contains-a-mark-decoration/3931/3)

# ๐ 2022/09/09

## ๅบงๅธๅฃๆทใใใ

### ๅ็งๅบๆฅใใใชใณใผใ

[codeMirror6PlaySandBox/index.js at a42f6d79ece6ced0f1506d54ee72b1bf3cf7de66 ยท pome-ta/codeMirror6PlaySandBox](https://github.com/pome-ta/codeMirror6PlaySandBox/blob/a42f6d79ece6ced0f1506d54ee72b1bf3cf7de66/outModules/%40codemirror/language/dist/index.js#L1232)

`unfoldEffect` ใง่งฃ้ค็ใช๏ผ

# ๐ 2022/09/08

## ใใใใ ๆง็ฏ

ๆๅญใซใๅบงๅธๅฃใๆทใใใใจ่ใใฆใใ

ใจใใใใใใตใณใใซใฎใณใผใใใใใพใใใใฟใใใชใชใใธใใชใใใฃใฆใใใใใใช

# ๐ 2022/09/03

## ในใใ(ใฟใใใงใใ) ใใใคในใฎๅคๅฎ

[JavaScript ใซใใใใใคในใฎๅคๅฎใฎใใใใ](https://zenn.dev/jamband/scraps/3749203f91875c)

```js
export const hasTouchScreen = () => {
  if (navigator.maxTouchPoints > 0) {
    return true;
  }
  if (navigator.msMaxTouchPoints > 0) {
    return true;
  }
  if (window.matchMedia("(pointer:coarse)").matches) {
    return true;
  }
  if ("orientation" in window) {
    return true;
  }

  return false;
};
```

# ๐ 2022/08/31

## ใจใใฃใฟใฎ็น็ท

```.js
const baseTheme$1 = /*@__PURE__*/ buildTheme(
  '.' + baseThemeID,
  {
    '&.cm-editor': {
      position: 'relative !important',
      boxSizing: 'border-box',
      '&.cm-focused': {
        // Provide a simple default outline to make sure a focused
        // editor is visually distinct. Can't leave the default behavior
        // because that will apply to the content element, which is
        // inside the scrollable container and doesn't include the
        // gutters. We also can't use an 'auto' outline, since those
        // are, for some reason, drawn behind the element content, which
        // will cause things like the active line background to cover
        // the outline (#297).
        outline: '1px dotted #212121',
      },
```

Provide a simple default outline to make sure a focused editor is visually distinct. Can't leave the default behavior because that will apply to the content element, which is inside the scrollable container and doesn't include the gutters. We also can't use an 'auto' outline, since those are, for some reason, drawn behind the element content, which will cause things like the active line background to cover the outline (#297).

# ๐ 2022/08/30

## Working Copy ใงใฎ`merge`

ๅคใ branch ใฎ็ถๆใงใๆฐใใ branch ใ้ธใณ`merge`ใใใ

`allow fast-forward` ใใฆใใ

ใใคใๅฟใใใฎใง

# ๐ 2022/08/21

ใใฟใณ้กใฏใฏใฉในๅใใฆใ่ฟฝๅ ใใๅ้คใใๅฎนๆใซใใใ๏ผ

ๆๅญๅใๅคๆฐๅใใใ๏ผ

# ๐ 2022/08/20

## ใฐใฐใฃใใคใใงใฎใกใข

่ๆฏ่ฒ่จญๅฎใฎๆใซไฝใๅฝน็ซใคใใ๏ผ

[CSS ใง่กใงใฏใชใใใญในใใฎๅพใใซใ ใ่ๆฏ่ฒใๆทใใใ๏ผ | yanagi's memo](https://ponsyon.com/archives/4623)

## ใใฟใณ้ก

้ฉๅฝใซ่ฟฝๅ ใใพใใฃใ

ไฝๅใๅผใณๅบใใใใฆใใฆใๅน็ใๆชใ๏ผ

## logArea

`p` ใงๆฌๅฝใซใใใฎใ ใใใ๏ผใชใใใไธไธไธญๅคฎใ ใจใ`span` ?

## webgl2

ๆฉใใฌใณใใชใณใฐใฎๆธใ็ดใใใใชใใจใใใ

# ๐ 2022/08/19

## todo

- iOS safari ใฎใใใผใซใใผใ้่กจ็คบใใงใๆไฝใใผไฝ็ฝฎใใใๅ้ก
- pc ๆใซใๆไฝใใผๅบใๅ้ก
- webgl ็ตใฟ็ดใ
- ใญใฃใฌใใ็งปๅใฏใใใใใใใฟใณใๅฅใใ๏ผ
- ๆไฝใใผ 2 ๆฎต็ตใฟ๏ผ

# ๐ 2022/08/18

ใจใฉใผใๆกใใคใถใใฆใใใพใ๏ผ๏ผ๏ผ๏ผ

# ๐ 2022/08/17

```.js
EditorView.updateListener.of((v) => {
  if (v.docChanged) {
    updateLog(v.state.doc.toString());
  }
}),
```

2 ้ใซใจใฃใกใใฃใใใๅฅๅใซใฉใฐใใใฃใใใกใใฃใจๅฑๆฉๆชใใชๆๅใใใฆใใ

[CodeMirror 6: Proper way to listen for changes - discuss.CodeMirror](https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/10)

ใใใใง่งฃๆฑบใงใใใ๏ผ

# ๐ 2022/08/12

## ใใคใฉใคใ่จญๅฎ

ๆๅญ่ๆฏใ้้ใใใใใคใฏใๆๅฎๆนๆณใๅคๅใกใใ

`backgroundColor` ใไธๆฌใง่จญๅฎใใฆใใพใใจใ`color` ใไธๆธใใใใกใใ

## ่ๅพใซ`canvas` ใจใใฆ glsl ใฎไฝใ่จญ็ฝฎ

ใใฃใใๆ็ดใซใใใฟใงๆธใๅใ

ๅใซๅฝขใไฝใใใ

# ๐ 2022/08/11

## ่ๆฏ theme

- ๅๆใงใtheme ใฎ highlight ่ฆ็ด ๅจ้จใซ`backgroundColor` ใไป่พผใใ 
- ใใๅฐใใๆๅใฎๆฎต้ใงๅๆ ใใใใจใฏใงใใใใใใ
- ็พๅจใฏใjs ใงใฎใใคใฉใคใ่จญๅฎใชใฎใงใGLSL ใซใใๆใฎๆๅใๅฟ้

## Underlining Command

- [CodeMirror Decoration Example](https://codemirror.net/examples/decoration/)

## ใใญในใ่ฆ็ด ใฎๅๅพ

- [CodeMirror Split View Example](https://codemirror.net/examples/split/)

- [CodeMirror 6: Proper way to listen for changes - discuss.CodeMirror](https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395)

# ๐ 2022/08/10

## theme

- ่้ข้้ใจใๆๅญใฎใจใใใกใใฃใจ้้ใใใใ
- one dark ใใฉใใงใๅผใณๅบใๆธใๆใใใ

# ๐ 2022/08/08

## todo ---

- whitespace ใจ indent
  - 2 ใคไธฆใใงใใใ็ฝฎใๆใใจใใงใใใใช๏ผ
- undo redo ใขใฏใทใงใณ
  - [run a code with click event - discuss.CodeMirror](https://discuss.codemirror.net/t/run-a-code-with-click-event/4820)
  - ใใใงใใใ๏ผ

# ๐ 2022/08/07

## ๐ค

- `tabSize` ใฎๆๅใ่ฌ
  - `EditorState.tabSize.of(16),`
  - ไฝใใฉใฎใใใซๅฝฑ้ฟใใฆใใใฎใ ใใใ

# ๐ 2022/08/06

## `minimalSetup` ใจใ`basicSetup`

ๅทฎๅใงใๆฌฒใใใใฎใๅฅใใฆใใ

## todo ใ

- fontSize
- ็ฉบ็ฝ
- ใคใณใใณใ
  - [replit/codemirror-indentation-markers: A CodeMirror extension that renders indentation markers](https://github.com/replit/codemirror-indentation-markers)
- `EditorState.create`
  - ไฝฟใใชใใ`doc` ใจใใใใฃใก

## ใตใ ๐ค

- ใใใใ ใชใปใใใฃใณใฐใๅฆใ
- ้ขๆฐใๆค็ฅใใฆใพใจใใใใคใใใชใ๏ผ
- ใคใณใใณใใฌใใซใใใใใคใใ
- undo, redo ใๆฐ่ปฝใซๅผใณๅบใ
- glsl ็จใฎใใคไฝใ๏ผ
- npm ใง่ฟฝๅ ใใใใๆฏๅ codesandbox ๅดใงไธๆฌใคใณในใใผใซๅฟ่ฆ๏ผ
- `tabSize` ใ่ฌใใใ

# ๐ 2022/08/04

## ใ ๐

- ๅฅๅใงใใชใ๏ผ

  - css ใงใฟใใๅถๅพกใใฆใพใใใใใ

- `extensions` ใฎๅผใณๅบใ
  - ้ๅปใฎๅ็งใใฆใใตใคใใฏๅคใๅ ดๅใใ
  - ๅบๆฌ็ใชใฎใฏ[basic-setup/codemirror.ts at main ยท codemirror/basic-setup](https://github.com/codemirror/basic-setup/blob/main/src/codemirror.ts) ใใใใ็ขบ่ชใใใฎใใใใใ๏ผ

## todo ใใ

- ๆน่ก
  - `Compartment`
- ็ฉบ็ฝๆค็ฅ
- ใทใณใฟใใฏในใใคใฉใคใ
- theme
  - ใพใ ๅผใณๅบใใฆใชใ
- ไปๆงใฎ็่งฃ

## ๆณๅฎ

ๅคงไฝ fix ใใใใrollup ใใฆ็ชใฃ่พผใ

## lsp

[marc2332/lsp-codemirror: LSP integration for CodeMirror](https://github.com/marc2332/lsp-codemirror)
