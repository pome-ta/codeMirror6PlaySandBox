// ts-worker.js
importScripts(
  // ESM loader 形式で使うなら import でも可。ただし Worker で module 対応が必要。
  // 例: import { createVirtualTypeScriptEnvironment, createDefaultMapFromCDN, createSystem } from "https://cdn.jsdelivr.net/npm/@typescript/vfs/+esm";
  // importScripts で UMD 版などを読み込む場合もあり。
);

// 以下は擬似コード/例示
let ts;           // TypeScript 本体モジュール
let vfs;          // @typescript/vfs モジュール
let tsEnv;        // 言語サービス環境

async function init() {
  // 例:esm 形式でロード (実際は Worker を module モードで起動する)
  const vfsModule = await import("https://cdn.jsdelivr.net/npm/@typescript/vfs@latest/+esm");
  const tsModule = await import("https://cdn.jsdelivr.net/npm/typescript@latest/+esm");
  vfs = vfsModule;
  ts = tsModule.default;

  // 仮想ファイルシステムの初期化
  const defaultMap = await vfs.createDefaultMapFromCDN(
    { target: ts.ScriptTarget.ES2020 },
    ts.version,
    /* includeLibs = */ true,
    ts
  );
  const system = vfs.createSystem(defaultMap);

  tsEnv = vfs.createVirtualTypeScriptEnvironment(
    system,
    /* existing files: */ [],
    ts,
    { allowJs: true }
  );
}

// メインからのメッセージ受信
self.onmessage = async (ev) => {
  const msg = ev.data;
  const { id, method, params } = msg;

  if (!tsEnv) {
    await init();
  }

  // ファイル更新通知(didOpen / didChange 相当)
  if (method === "updateFile") {
    const { uri, content } = params;
    tsEnv.updateFile(uri, content);
    // 通知なので返り値なし
    return;
  }

  // 補完リクエスト
  if (method === "completion") {
    const { uri, position } = params;
    const result = tsEnv.getCompletionAtPosition(uri, position);
    // 補完アイテムを整形
    const items = (result?.entries || []).map(entry => ({
      label: entry.name,
      kind: entry.kind,
      // その他必要なプロパティ変換を加える
    }));
    postMessage({ id, result: { items } });
    return;
  }

  // 型チェック/診断リクエスト
  if (method === "diagnostics") {
    const { uri } = params;
    const diags = tsEnv.getSemanticDiagnostics(uri).concat(tsEnv.getSyntacticDiagnostics(uri));
    const formatted = diags.map(d => ({
      message: d.messageText,
      start: d.start,
      length: d.length,
      category: d.category,
      code: d.code
    }));
    postMessage({ id, result: formatted });
    return;
  }

  // 定義ジャンプリクエスト
  if (method === "definition") {
    const { uri, position } = params;
    const def = tsEnv.getDefinitionAtPosition(uri, position);
    // def は複数位置の可能性あり
    postMessage({ id, result: def });
    return;
  }

  // 未知メソッド
  postMessage({ id, error: `Unknown method ${method}` });
};
