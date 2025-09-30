// ts-worker.js
// Worker を module として起動する想定: new Worker('./ts-worker.js', { type: 'module' })
//
// 概要:
// - @typescript/vfs を使って仮想ファイルシステムと TypeScript 言語サービス環境を作る
// - main スレッドから受け取る JSON-RPC 風のリクエストに応答する(initialize / didOpen / didChange / completion / diagnostics / definition)
// - すべての入出力は文字列化した JSON で行う(postMessage で JSON.stringify した文字列を返す)
//
/* 日本語詳細コメント多数で理解をサポートします */

import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment
} from '@typescript/vfs'; // importmap が有効な前提
import ts from 'typescript'; // importmap が "typescript" を指している前提

// 仮想環境とファイル内容のキャッシュを保持
let env = null; // createVirtualTypeScriptEnvironment の戻り値
const fileContents = new Map(); // path(string) -> content(string)
let booted = false;

// 起動処理:CDN から標準 lib を読み込み、仮想 FS と言語サービス環境を作る
async function boot() {
  if (booted) return;
  // createDefaultMapFromCDN は CDN から lib.dom.d.ts などを取得して仮想 FS の初期状態を作る
  const defaultMap = await createDefaultMapFromCDN({ target: ts.ScriptTarget.ES2022 }, ts.version, /* includeLibs */ true, ts);
  const system = createSystem(defaultMap);
  // 空ファイル配列で環境を作る。後から createFile/updateFile で追加する。
  env = createVirtualTypeScriptEnvironment(system, [], ts, { allowJs: true });
  booted = true;
}

// ユーティリティ:URI を内部 path に変換(file:///main.ts -> main.ts のように扱う)
function uriToPath(uri) {
  if (!uri) return uri;
  if (uri.startsWith('file:///')) return uri.slice('file:///'.length);
  if (uri.startsWith('file://')) return uri.slice('file://'.length);
  return uri;
}

// 文字列オフセット ↔ LSP 的な {line,character} 変換ユーティリティ
function offsetToPos(text, offset) {
  const sliced = text.slice(0, Math.max(0, Math.min(offset, text.length)));
  const lines = sliced.split('\n');
  return { line: lines.length - 1, character: lines[lines.length - 1].length };
}
function posToOffset(text, pos) {
  const lines = text.split('\n');
  const line = Math.max(0, Math.min(pos.line || 0, lines.length - 1));
  let off = 0;
  for (let i = 0; i < line; i++) off += lines[i].length + 1; // '\n'
  off += Math.max(0, Math.min(pos.character || 0, lines[line].length));
  return off;
}

// TypeScript の symbol-kind -> LSP の CompletionItemKind の大まかな対応
function tsKindToLspKind(kind) {
  const map = {
    method: 2, function: 3, constructor: 4, field: 5, variable: 6,
    class: 7, interface: 8, module: 9, property: 10, unit: 11,
    value: 12, enum: 13, keyword: 14, snippet: 15, text: 1
  };
  return map[kind] || 6;
}

// Diagnostic の category -> LSP severity
function diagCategoryToSeverity(cat) {
  if (cat === ts.DiagnosticCategory.Error) return 1;     // Error
  if (cat === ts.DiagnosticCategory.Warning) return 2;   // Warning
  if (cat === ts.DiagnosticCategory.Suggestion) return 3;// Information/Suggestion
  return 4;
}

// JSON-RPC 風のメッセージを処理する
async function handleMessage(msg) {
  await boot(); // 必ず環境を初期化しておく

  const { id, method, params } = msg;

  // initialize: LSP の初期化要求に対する最小限の応答
  if (method === 'initialize') {
    const result = {
      capabilities: {
        // 補完対応を示す(トリガーは '.' 等を含めておく)
        completionProvider: { resolveProvider: false, triggerCharacters: ['.', '(', ':'] },
        // 定義ジャンプなどをサポート(必要に応じて拡張可能)
        definitionProvider: true,
        // diagnostics はサーバから通知する場合とクライアントから要求する場合がある
      }
    };
    postMessage(JSON.stringify({ jsonrpc: "2.0", id: id ?? null, result }));
    return;
  }

  // textDocument/didOpen: ドキュメントを開いた通知。ファイルを仮想 FS に登録する
  if (method === 'textDocument/didOpen') {
    const td = params?.textDocument;
    const uri = td?.uri;
    const path = uriToPath(uri);
    const text = td?.text ?? '';
    fileContents.set(path, text);
    // env.createFile は既存だと例外を投げるので try/catch で updateFile を試す
    try { env.createFile(path, text); }
    catch (e) { try { env.updateFile(path, text); } catch (_) { env.sys.writeFile(path, text); } }
    // didOpen は notification(応答不要)
    return;
  }

  // textDocument/didChange: ドキュメント更新通知(LSP の full text 式に対応)
  if (method === 'textDocument/didChange') {
    const td = params?.textDocument || {};
    const uri = td.uri || params?.uri;
    const path = uriToPath(uri);
    // LSP の contentChanges のうち最初の full text を優先して使う(簡易実装)
    let text = null;
    if (params?.content !== undefined) text = params.content;
    else if (params?.contentChanges && params.contentChanges.length) text = params.contentChanges[0].text;
    else if (params?.text !== undefined) text = params.text;
    if (text !== null) {
      fileContents.set(path, text);
      try { env.updateFile(path, text); } catch (e) { try { env.createFile(path, text); } catch (_) { env.sys.writeFile(path, text); } }
    }
    // notification なので応答なし
    return;
  }

  // textDocument/completion: 補完リクエスト
  if (method === 'textDocument/completion') {
    const uri = params?.textDocument?.uri;
    const path = uriToPath(uri);
    const content = fileContents.get(path) ?? '';
    const pos = params?.position ?? { line:0, character:0 };
    const offset = posToOffset(content, pos);

    // TypeScript の補完 API を呼ぶ
    const completions = env.languageService.getCompletionsAtPosition(path, offset, { allowIncompleteCompletions: true });
    let items = [];
    if (completions && completions.entries) {
      items = completions.entries.map(e => ({
        label: e.name,
        kind: tsKindToLspKind(e.kind),
        detail: e.kind,
      }));
    }

    // LSP の CompletionList 互換で返す
    postMessage(JSON.stringify({ jsonrpc: "2.0", id, result: { isIncomplete: false, items } }));
    return;
  }

  // textDocument/diagnostics: diagnostics(要求型)を返す
  if (method === 'textDocument/diagnostics' || method === 'workspace/diagnostics') {
    const uri = params?.textDocument?.uri || params?.uri;
    const path = uriToPath(uri);
    const content = fileContents.get(path) ?? '';

    const synt = env.languageService.getSyntacticDiagnostics(path) || [];
    const sem = env.languageService.getSemanticDiagnostics(path) || [];
    const all = [...synt, ...sem];

    const mapped = all.map(d => {
      const start = d.start ?? 0;
      const len = d.length ?? 0;
      const r1 = offsetToPos(content, start);
      const r2 = offsetToPos(content, start + len);
      const msg = typeof d.messageText === 'string' ? d.messageText : (d.messageText?.message || JSON.stringify(d.messageText));
      return {
        range: { start: r1, end: r2 },
        message: msg,
        severity: diagCategoryToSeverity(d.category),
        code: d.code
      };
    });

    postMessage(JSON.stringify({ jsonrpc: "2.0", id, result: mapped }));
    return;
  }

  // textDocument/definition: 定義ジャンプ(位置配列を返す)
  if (method === 'textDocument/definition') {
    const uri = params?.textDocument?.uri;
    const path = uriToPath(uri);
    const content = fileContents.get(path) ?? '';
    const pos = params?.position ?? { line:0, character:0 };
    const offset = posToOffset(content, pos);

    const defs = env.languageService.getDefinitionAtPosition(path, offset) || [];
    const mapped = defs.map(d => {
      const defPath = d.fileName;
      const defContent = fileContents.get(defPath) ?? (env.sys.readFile(defPath) ?? '');
      const span = d.textSpan || { start:0, length:0 };
      const start = span.start || 0;
      const end = start + (span.length || 0);
      return {
        uri: 'file:///' + defPath,
        range: { start: offsetToPos(defContent, start), end: offsetToPos(defContent, end) }
      };
    });

    postMessage(JSON.stringify({ jsonrpc: "2.0", id, result: mapped }));
    return;
  }

  // 未知のリクエストはエラーで応答(id がある場合)
  if (id !== undefined) {
    postMessage(JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32601, message: 'Method not found: ' + method } }));
  }
}

// Worker の受信入口:文字列/オブジェクトどちらにも対応してハンドリング
self.onmessage = (ev) => {
  const raw = ev.data;
  let obj = raw;
  if (typeof raw === 'string') {
    try { obj = JSON.parse(raw); } catch (e) {
      // パース失敗は JSON-RPC のパースエラーとして返す
      postMessage(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: 'Parse error' } }));
      return;
    }
  }
  // 非同期で処理(エラーは JSON-RPC エラーとして返す)
  Promise.resolve().then(() => handleMessage(obj)).catch(err => {
    const id = obj?.id ?? null;
    postMessage(JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32000, message: String(err) } }));
  });
};
