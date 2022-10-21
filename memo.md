# 📝 2022/10/21

カジュアルにcodemirror のupdate をしてみている

# 📝 2022/10/15

座布団が適宜`span` になっているので、いい感じにしたい

# 📝 2022/09/12

## 座布団

更新させたい

[How to remove a decoration mark from state - discuss.CodeMirror](https://discuss.codemirror.net/t/how-to-remove-a-decoration-mark-from-state/3809)

[How to check if a selection contains a mark decoration? - v6 - discuss.CodeMirror](https://discuss.codemirror.net/t/how-to-check-if-a-selection-contains-a-mark-decoration/3931/3)

# 📝 2022/09/09

## 座布団敷きたい

### 参照出来そうなコード

[codeMirror6PlaySandBox/index.js at a42f6d79ece6ced0f1506d54ee72b1bf3cf7de66 · pome-ta/codeMirror6PlaySandBox](https://github.com/pome-ta/codeMirror6PlaySandBox/blob/a42f6d79ece6ced0f1506d54ee72b1bf3cf7de66/outModules/%40codemirror/language/dist/index.js#L1232)

`unfoldEffect` で解除的な？

# 📝 2022/09/08

## ミニマム構築

文字に、座布団を敷きたいと考えている

とりあえず、サンプルのコードをやりまくる。みたいなリポジトリがあってもいいかもな

# 📝 2022/09/03

## スマホ(タッチできる) デバイスの判定

[JavaScript によるデバイスの判定のあれこれ](https://zenn.dev/jamband/scraps/3749203f91875c)

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

# 📝 2022/08/31

## エディタの点線

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

# 📝 2022/08/30

## Working Copy での`merge`

古い branch の状態で、新しい branch を選び`merge`する。

`allow fast-forward` している

いつも忘れるので

# 📝 2022/08/21

ボタン類はクラス化して、追加やら削除やら容易にするか？

文字列を変数化さすか？

# 📝 2022/08/20

## ググったついでのメモ

背景色設定の時に何か役立つかも？

[CSS で行ではなくテキストの後ろにだけ背景色を敷きたい！ | yanagi's memo](https://ponsyon.com/archives/4623)

## ボタン類

適当に追加しまくった

何回も呼び出しをしていて、効率が悪い？

## logArea

`p` で本当にいいのだろうか？なんか、上下中央だと、`span` ?

## webgl2

早くレンダリングの書き直しをしないと。。。

# 📝 2022/08/19

## todo

- iOS safari の「ツールバーを非表示」で、操作バー位置ずれる問題
- pc 時に、操作バー出る問題
- webgl 組み直し
- キャレット移動は、ポチポチボタンも入れる？
- 操作バー 2 段組み？

# 📝 2022/08/18

エラーを握りつぶしております！！！！

# 📝 2022/08/17

```.js
EditorView.updateListener.of((v) => {
  if (v.docChanged) {
    updateLog(v.state.doc.toString());
  }
}),
```

2 重にとっちゃったり、入力にラグがあったりちょっと危機怪々な挙動をしている

[CodeMirror 6: Proper way to listen for changes - discuss.CodeMirror](https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/10)

ここらで解決できそう？

# 📝 2022/08/12

## ハイライト設定

文字背景を透過させるやつは、指定方法が多分ちがう

`backgroundColor` を一括で設定してしまうと、`color` も上書きされちゃう

## 背後に`canvas` として glsl の何か設置

いったん愚直に、ベタで書き切る

先に形を作りたい

# 📝 2022/08/11

## 背景 theme

- 力技で、theme の highlight 要素全部に`backgroundColor` を仕込んだ
- もう少し、手前の段階で反映することはできそう。。。
- 現在は、js でのハイライト設定なので、GLSL にした時の挙動が心配

## Underlining Command

- [CodeMirror Decoration Example](https://codemirror.net/examples/decoration/)

## テキスト要素の取得

- [CodeMirror Split View Example](https://codemirror.net/examples/split/)

- [CodeMirror 6: Proper way to listen for changes - discuss.CodeMirror](https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395)

# 📝 2022/08/10

## theme

- 背面透過と、文字のところちょっと透過をしたい
- one dark をどこで、呼び出し書き換えるか

# 📝 2022/08/08

## todo ---

- whitespace と indent
  - 2 つ並んでたら、置き換えとかできるかな？
- undo redo アクション
  - [run a code with click event - discuss.CodeMirror](https://discuss.codemirror.net/t/run-a-code-with-click-event/4820)
  - これでいける？

# 📝 2022/08/07

## 🤔

- `tabSize` の挙動が謎
  - `EditorState.tabSize.of(16),`
  - 何がどのように影響しているのだろうか

# 📝 2022/08/06

## `minimalSetup` と、`basicSetup`

差分で、欲しいものを入れていく

## todo ぅ

- fontSize
- 空白
- インデント
  - [replit/codemirror-indentation-markers: A CodeMirror extension that renders indentation markers](https://github.com/replit/codemirror-indentation-markers)
- `EditorState.create`
  - 使うなら、`doc` とかもこっち

## ふむ 🤔

- ミニマムなセッティングか否か
- 関数を検知してまとめるやついらない？
- インデントレベルがわかりつらい
- undo, redo を気軽に呼び出し
- glsl 用のやつ作る？
- npm で追加したら、毎回 codesandbox 側で一括インストール必要？
- `tabSize` が謎すぎる

# 📝 2022/08/04

## え 😅

- 入力できない？

  - css でタップ制御してました、、、

- `extensions` の呼び出し
  - 過去の参照してるサイトは古い場合あり
  - 基本的なのは[basic-setup/codemirror.ts at main · codemirror/basic-setup](https://github.com/codemirror/basic-setup/blob/main/src/codemirror.ts) ここから確認するのがよさそう？

## todo ぅう

- 改行
  - `Compartment`
- 空白検知
- シンタックスハイライト
- theme
  - まだ呼び出せてない
- 仕様の理解

## 想定

大体 fix したら、rollup して突っ込む

## lsp

[marc2332/lsp-codemirror: LSP integration for CodeMirror](https://github.com/marc2332/lsp-codemirror)
