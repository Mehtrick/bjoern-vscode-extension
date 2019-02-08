import * as vscode from "vscode";

export class KeyWordCompletionProvider implements vscode.CompletionItemProvider {
	initialWords: string[] = [
		"- Scenario: ",
		"Scenarios:\n  - Scenario: ",
		"Feature: ",
		"Given:\n  - ",
		"When:\n  - ",
		"Then:\n  - "
	];
	provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken) {
		var items: vscode.CompletionItem[] = [];
		this.initialWords.forEach(element => {
			items.push(new vscode.CompletionItem(element, vscode.CompletionItemKind.Method));
		});
		return items;
	}
}
