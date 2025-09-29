import {
  createDefaultMapFromCDN,
  createSystem,
  createVirtualTypeScriptEnvironment,
} from '@typescript/vfs';
import ts from 'typescript';

// Worker provides a small JSON-RPC-like LSP subset:
// - requests: { jsonrpc:"2.0", id?, method, params }
// - responses: { jsonrpc:"2.0", id, result? , error? }
// Supported methods: initialize, textDocument/didOpen, textDocument/didChange, textDocument/completion, textDocument/diagnostics, textDocument/definition

let env = null;             // virtual ts environment
const fileContents = new Map(); // keep current text for quick offset calculations
let initialized = false;

async function boot() {
  if (initialized) return;
  // create default lib map (loads lib.*.d.ts automatically from CDN)
  const fsMap = await createDefaultMapFromCDN({ target: ts.ScriptTarget.ES2022 }, ts.version, /* include lib */ true, ts);
  const system = createSystem(fsMap);
  env = createVirtualTypeScriptEnvironment(system, [], ts, { allowJs: true });
  initialized = true;
}

function uid() { return Math.floor(Math.random()*1e9).toString(); }

// URI <-> path mapping (we store plain "main.ts")
function uriToPath(uri) {
  if (!uri) return uri;
  if (uri.startsWith('file:///')) return uri.slice('file:///'.length);
  if (uri.startsWith('file://')) return uri.slice('file://'.length);
  return uri;
}

function offsetToPos(text, offset) {
  const lines = text.slice(0, offset).split('\n');
  const line = lines.length - 1;
  const character = lines[lines.length - 1].length;
  return { line, character };
}
function posToOffset(text, position) {
  const lines = text.split('\n');
  const line = Math.max(0, Math.min(position.line, lines.length - 1));
  let off = 0;
  for (let i = 0; i < line; i++) off += lines[i].length + 1; // +1 for '\n'
  off += Math.max(0, Math.min(position.character, lines[line].length));
  return off;
}

function tsKindToLspKind(kind) {
  // rough mapping
  const map = {
    'method': 2, 'function': 3, 'constructor': 4, 'field': 5, 'variable': 6,
    'class': 7, 'interface': 8, 'module': 9, 'property': 10, 'unit': 11,
    'value': 12, 'enum': 13, 'keyword': 14, 'snippet': 15, 'text': 1
  };
  return map[kind] || 6;
}

function diagCategoryToSeverity(cat) {
  // ts.DiagnosticCategory: 0 = Warning, 1 = Error, 2 = Suggestion, 3 = Message (enum may differ)
  if (cat === ts.DiagnosticCategory.Error) return 1;
  if (cat === ts.DiagnosticCategory.Warning) return 2;
  if (cat === ts.DiagnosticCategory.Suggestion) return 3;
  return 4;
}

async function handleMessage(msg) {
  await boot();
  const { id, method, params } = msg;

  if (method === 'initialize') {
    postMessage(JSON.stringify({ jsonrpc: "2.0", id: id ?? null, result: { capabilities: { completionProvider: { triggerCharacters: ['.', '(', ':'] }, diagnostics: true } } }));
    return;
  }

  if (method === 'textDocument/didOpen') {
    const td = params?.textDocument;
    const uri = td?.uri;
    const path = uriToPath(uri);
    const text = td?.text ?? '';
    fileContents.set(path, text);
    // create or update file in env
    try {
      env.createFile(path, text);
    } catch (e) {
      // createFile throws if exists; use updateFile
      env.updateFile(path, text);
    }
    return; // notification
  }

  if (method === 'textDocument/didChange') {
    // accept either full-text in params.content, or LSP style contentChanges
    const uri = params?.textDocument?.uri || params?.uri;
    const path = uriToPath(uri);
    let text = null;
    if (params?.content !== undefined) text = params.content;
    else if (params?.contentChanges && params.contentChanges.length) text = params.contentChanges[0].text;
    else if (params?.text !== undefined) text = params.text;
    if (text !== null) {
      fileContents.set(path, text);
      try { env.updateFile(path, text); } catch (e) { env.createFile(path, text); }
    }
    return;
  }

  if (method === 'textDocument/completion') {
    const uri = params?.textDocument?.uri;
    const path = uriToPath(uri);
    const content = fileContents.get(path) ?? '';
    const pos = params?.position ?? { line: 0, character: 0 };
    const offset = posToOffset(content, pos);

    const completions = env.languageService.getCompletionsAtPosition(path, offset, { allowIncompleteCompletions: true });
    let items = [];
    if (completions && completions.entries) {
      items = completions.entries.map(e => ({
        label: e.name,
        kind: tsKindToLspKind(e.kind),
        detail: e.kind,
      }));
    }
    postMessage(JSON.stringify({ jsonrpc: "2.0", id, result: items }));
    return;
  }

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

  if (method === 'textDocument/definition') {
    const uri = params?.textDocument?.uri;
    const path = uriToPath(uri);
    const content = fileContents.get(path) ?? '';
    const pos = params?.position ?? { line: 0, character: 0 };
    const offset = posToOffset(content, pos);
    const defs = env.languageService.getDefinitionAtPosition(path, offset) || [];
    const mapped = defs.map(d => {
      const defPath = d.fileName;
      // read def file content (may be in fs)
      let defContent = fileContents.get(defPath) ?? env.sys.readFile(defPath) ?? '';
      const span = d.textSpan;
      const start = span.start ?? 0;
      const end = start + (span.length ?? 0);
      return {
        uri: 'file:///' + defPath,
        range: { start: offsetToPos(defContent, start), end: offsetToPos(defContent, end) }
      };
    });
    postMessage(JSON.stringify({ jsonrpc: "2.0", id, result: mapped }));
    return;
  }

  // unknown
  if (id !== undefined) {
    postMessage(JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32601, message: 'Method not found: ' + method } }));
  }
}

// worker message entry
self.onmessage = (ev) => {
  const raw = ev.data;
  let msg = raw;
  if (typeof raw === 'string') {
    try { msg = JSON.parse(raw); } catch (e) { postMessage(JSON.stringify({ jsonrpc: "2.0", id: null, error: { code: -32700, message: "Parse error" }})); return; }
  }
  handleMessage(msg).catch(err => {
    const id = msg?.id ?? null;
    postMessage(JSON.stringify({ jsonrpc: "2.0", id, error: { code: -32000, message: String(err) } }));
  });
};

