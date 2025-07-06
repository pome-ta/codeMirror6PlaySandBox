import { lspClient } from './codemirror.bundle.js';

export const {
  LSPClient, LSPPlugin, Workspace, WorkspaceMapping, closeReferencePanel, findReferences, findReferencesKeymap, formatDocument, formatKeymap, hoverTooltips, jumpToDeclaration, jumpToDefinition, jumpToDefinitionKeymap, jumpToImplementation, jumpToTypeDefinition, languageServerSupport, nextSignature, prevSignature, renameKeymap, renameSymbol, serverCompletion, serverCompletionSource, showSignatureHelp, signatureHelp, signatureKeymap,
} = lspClient;
