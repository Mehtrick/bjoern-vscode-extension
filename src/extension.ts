// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { BjoernCompletionProvider } from "./completionprovider/BjoernCompletionProvider";
import { KeyWordCompletionProvider } from "./completionprovider/KeyWordCompletionProvider";
import { BjoernHighlightProvider } from "./highlightprovider/BjoernHighlightProvider";
import { BjoernDiagnosticsProvider } from "./BjoernDiagnosticsProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const documentSelector: vscode.DocumentSelector = {
    language: 'bjoern',
  };


  var keyWordCompletionProvider = vscode.languages.registerCompletionItemProvider(
    documentSelector,
    new KeyWordCompletionProvider()
  );
  var bjoernCompletionProvider = vscode.languages.registerCompletionItemProvider(
    documentSelector,
    new BjoernCompletionProvider(), "-"
  );
  var bjoernHighlightProvider = vscode.languages.registerDocumentHighlightProvider(
    documentSelector,
    new BjoernHighlightProvider()
  );
  var diagnosticCollection = vscode.languages.createDiagnosticCollection('bjoern');

  if (vscode.window.activeTextEditor) {
     new BjoernDiagnosticsProvider().updateDiagnostics(vscode.window.activeTextEditor.document, diagnosticCollection);
  }
  context.subscriptions.push(bjoernCompletionProvider, keyWordCompletionProvider, bjoernHighlightProvider);
  context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(event => {
    new BjoernDiagnosticsProvider().updateDiagnostics(event.document, diagnosticCollection)
  }
  ));
}

// this method is called when your extension is deactivated
export function deactivate() { }





