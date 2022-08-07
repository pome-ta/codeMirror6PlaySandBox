# 📝 2022/08/07

## 🤔

- `tabSize` の挙動が謎
  - `EditorState.tabSize.of(16),`
  - 何がどのように影響しているのだろうか

# 📝 2022/08/06

## `minimalSetup` と、`basicSetup`

差分で、欲しいものを入れていく

## todo

- fontSize
- 空白
- インデント
  - [replit/codemirror-indentation-markers: A CodeMirror extension that renders indentation markers](https://github.com/replit/codemirror-indentation-markers)

## 🤔

- ミニマムなセッティングか否か
- 関数を検知してまとめるやついらない？
- インデントレベルがわかりつらい
- undo, redo を気軽に呼び出し
- glsl 用のやつ作る？
- npm で追加したら、毎回codesandbox 側で一括インストール必要？

# 📝 2022/08/04

## 😅

- 入力できない？
  - css でタップ制御してました、、、

- `extensions` の呼び出し
  - 過去の参照してるサイトは古い場合あり
  - 基本的なのは[basic-setup/codemirror.ts at main · codemirror/basic-setup](https://github.com/codemirror/basic-setup/blob/main/src/codemirror.ts) ここから確認するのがよさそう？

## todo

- 改行
  - `Compartment`
- 空白検知
- シンタックスハイライト
- theme
  - まだ呼び出せてない
- 仕様の理解

## 想定

大体fix したら、rollup して突っ込む

## lsp

[marc2332/lsp-codemirror: LSP integration for CodeMirror](https://github.com/marc2332/lsp-codemirror)
