// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	var completionProvider:BjoernCompletionProvider = new BjoernCompletionProvider();
	
	let registerComplietionProvider = vscode.languages.registerCompletionItemProvider({ language: 'bjoern' }, completionProvider);
	context.subscriptions.push(registerComplietionProvider);
	}

// this method is called when your extension is deactivated
export function deactivate() {}


export class BjoernCompletionProvider implements vscode.CompletionItemProvider{
	initialWords:string[]= ["- Scenario: ","Scenarios:\n  - Scenario: ","Feature: ","Given:\n  - ","When:\n  - ","Then:\n  - "];

	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken){
		var items:vscode.CompletionItem[] = [];
		this.initialWords.forEach(element => {
			items.push(new vscode.CompletionItem(element,vscode.CompletionItemKind.Method));
		});
		var statements:Set<string>=this.parseStatements(document);
		statements.forEach(element=> {
			items.push(new vscode.CompletionItem(element,vscode.CompletionItemKind.Text));
		});
		return items;
	}

	parseStatements(document: vscode.TextDocument){
		var documentLines:string[] = document.getText().replace(" ","").replace(/"(.*?)"/g,"\"\"").split("\n").filter(this.filterStatement).map(s => s.trim());
		return new Set(documentLines);
	}

	filterStatement(element:string){
		return element.indexOf("-")>0 && !element.includes("Scenario");
	}

}