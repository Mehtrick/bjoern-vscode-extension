import * as vscode from "vscode";
import { Line } from "../BjoernDiagnosticsProvider";
import { BjoernKeywords } from "../BjoernKeywords";
import { BjoernKeywordsIndentation } from "../BjoernKeywordsIndentation";

export class BjoernCodeFormatter implements vscode.DocumentFormattingEditProvider {

    provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
        var textEdits: vscode.TextEdit[] = []
        var scenarios_recognized = false;
        var keywordLines: Line[] = document.getText()
            .split("\n")
            .map((l, index) => new Line(index, l))
            .filter(l => this.checkIfLineStartsWithKeyword(l));
        keywordLines.forEach(element => {
            if (element.text.startsWith(BjoernKeywords.Scenarios.toString())) {
                scenarios_recognized = true;
            }
            var foundKeyword = BjoernKeywordsIndentation.AllValues.find(keyword => element.text.startsWith(keyword.bjoenKeyword.toString()))
            if (foundKeyword) {
                if (scenarios_recognized) {
                    this.correctIndentation(foundKeyword.indentationInScenarios, element, document, textEdits);
                } else {
                    this.correctIndentation(foundKeyword.indentation, element, document, textEdits);
                }
            }
        });
        return textEdits;
    }


    checkIfLineStartsWithKeyword(line: Line): boolean {
        return Object.values(BjoernKeywords).some(keyword => {
            if (line.text.startsWith(keyword.toString())) {
                return true
            }
        })
    }

    correctIndentation(indentaionGoal: number, element: Line, document: vscode.TextDocument, textEdits: vscode.TextEdit[]) {
        if (document.lineAt(element.lineNumber).firstNonWhitespaceCharacterIndex !== indentaionGoal) {
            var beginPosition = new vscode.Position(element.lineNumber, 0);
            var numberOfWhitespaces = document.lineAt(element.lineNumber).firstNonWhitespaceCharacterIndex;
            if (numberOfWhitespaces < indentaionGoal) {
                var missingWhiteSpaceCount = indentaionGoal - numberOfWhitespaces+1
                var missingWhiteSpaces = Array(missingWhiteSpaceCount).join(" ")
                textEdits.push(vscode.TextEdit.insert(beginPosition, missingWhiteSpaces));
            } else {
                var tooManyWhitespacesCount = numberOfWhitespaces - indentaionGoal
                var endposition = new vscode.Position(element.lineNumber, tooManyWhitespacesCount);
                textEdits.push(vscode.TextEdit.delete(new vscode.Range(beginPosition, endposition)));
            }
        }
    }


}



