// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { BjoernCompletionProvider } from "./completionprovider/BjoernCompletionProvider";
import { KeyWordCompletionProvider } from "./completionprovider/KeyWordCompletionProvider";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  var completionProvider = vscode.languages.registerCompletionItemProvider(
    { language: "bjoern" },
    new KeyWordCompletionProvider()
  );
  var keyWordCompletionProvider = vscode.languages.registerCompletionItemProvider(
    { language: "bjoern" },
    new BjoernCompletionProvider(),
    "-"
  );
  context.subscriptions.push(completionProvider, keyWordCompletionProvider);
}

// this method is called when your extension is deactivated
export function deactivate() {}




