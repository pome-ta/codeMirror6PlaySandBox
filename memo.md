# 📝 2022/08/18

エラーを握りつぶしております！！！！

# 📝 2022/08/17

``` .js
EditorView.updateListener.of((v) => {
  if (v.docChanged) {
    updateLog(v.state.doc.toString());
  }
}),
```

2重にとっちゃったり、入力にラグがあったりちょっと危機怪々な挙動をしている

[CodeMirror 6: Proper way to listen for changes - discuss.CodeMirror](https://discuss.codemirror.net/t/codemirror-6-proper-way-to-listen-for-changes/2395/10)

ここらで解決できそう？

# 📝 2022/08/12

## ハイライト設定

文字背景を透過させるやつは、指定方法が多分ちがう

`backgroundColor` を一括で設定してしまうと、`color` も上書きされちゃう

## 背後に`canvas` としてglsl の何か設置

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

## todo

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
