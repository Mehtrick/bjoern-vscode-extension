// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var completionProvider = vscode.languages.registerCompletionItemProvider({ language: 'bjoern' }, new KeyWordCompletionProvider());
	var keyWordCompletionProvider = vscode.languages.registerCompletionItemProvider({ language: 'bjoern' }, new BjoernCompletionProvider(),"-");
	context.subscriptions.push(completionProvider,keyWordCompletionProvider);
	}

// this method is called when your extension is deactivated
export function deactivate() {}


export class BjoernCompletionProvider implements vscode.CompletionItemProvider{

	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken){
		var items:vscode.CompletionItem[] = [];
		var statements:Set<string>=this.parseStatements(document);
		statements.forEach(element=> {
			items.push(new vscode.CompletionItem(element,vscode.CompletionItemKind.Text));
		});
		return items;
	}

	parseStatements(document: vscode.TextDocument){
		var documentLines:string[] = document.getText().replace(" ","").replace(/"(.*?)"/g,"\"\"").split("\n").map(s => s.trim()).filter(this.filterStatement).map(s=> s.replace("-",""));
		return new Set(documentLines);
	}

	filterStatement(element:string){
		return element.startsWith("-") && !element.includes("Scenario");
	}

}

export class KeyWordCompletionProvider implements vscode.CompletionItemProvider{
	initialWords:string[]= ["- Scenario: ","Scenarios:\n  - Scenario: ","Feature: ","Given:\n  - ","When:\n  - ","Then:\n  - "];

	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken){
		var items:vscode.CompletionItem[] = [];
		this.initialWords.forEach(element => {
			items.push(new vscode.CompletionItem(element,vscode.CompletionItemKind.Method));
		});
		return items;
	}

}