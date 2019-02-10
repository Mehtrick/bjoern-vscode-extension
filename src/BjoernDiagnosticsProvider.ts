import * as vscode from "vscode";
import { BjoernKeywords } from "./BjoernKeywords";


export class BjoernDiagnosticsProvider {

  updateDiagnostics(document: vscode.TextDocument, collection: vscode.DiagnosticCollection): void {

    let diagnostics: vscode.Diagnostic[] = []
    this.checkFeatureKeyword(document, diagnostics);
    this.checkWhitespaceBeforeEveryStatement(document, diagnostics);
    this.checkKeywords(document, diagnostics);
    this.checkIndentation(document, diagnostics);
    this.checkNoEmptyStatements(document, diagnostics);
    this.checkKeywordsWithDescription(document, diagnostics);
    collection.clear();
    collection.set(document.uri, diagnostics);
  }


  checkKeywordsWithDescription(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]) {
    var keywordsWithDescription = [BjoernKeywords.Feature, BjoernKeywords.Scenario];
    var keywordLines: Line[] = document.getText().split("\n").map((l, index) => new Line(index, l)).filter(l => keywordsWithDescription.find(keyword => l.text.startsWith(keyword.toString() + ":")));
    keywordLines.forEach(line => {
      var documentLine = document.lineAt(line.lineNumber);
      var indexOfDescriptionOperator = documentLine.text.indexOf(":");
      var descriptionLength = documentLine.text.substring(indexOfDescriptionOperator + 1, documentLine.text.trimRight().length).length;
      if (descriptionLength === 0) {
        var beginning = documentLine.firstNonWhitespaceCharacterIndex;
        var beginPosition = new vscode.Position(line.lineNumber, beginning);
        var endPosition = new vscode.Position(line.lineNumber, indexOfDescriptionOperator + 1);
        diagnostics.push({
          message: 'The keyword needs a value. E.g. "Feature: This is a test"',
          range: new vscode.Range(beginPosition, endPosition),
          severity: vscode.DiagnosticSeverity.Error,
        });
      }
    });

  }


  checkNoEmptyStatements(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]) {
    var statements: Line[] = document.getText().split("\n").map((l, index) => new Line(index, l)).filter(l => l.text.startsWith("-"));
    statements.forEach(statement => {
      if (statement.text.trim().length === 1) {
        var keywordStart = document.lineAt(statement.lineNumber).firstNonWhitespaceCharacterIndex;
        var beginPosition = new vscode.Position(statement.lineNumber, keywordStart);
        var endPosition = new vscode.Position(statement.lineNumber, keywordStart + 1);
        diagnostics.push({
          message: 'A Statement must not be empty',
          range: new vscode.Range(beginPosition, endPosition),
          severity: vscode.DiagnosticSeverity.Error,
        });
      }
    })
  }

  checkIndentation(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]) {
    this.checkIndentationForFeatureBackgroundScenariosScenario(document, diagnostics);
  }

  checkIndentationForFeatureBackgroundScenariosScenario(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]) {
    var noWhitespaceIndentation = [BjoernKeywords.Feature, BjoernKeywords.Scenarios, BjoernKeywords.Background];
    var twoWhitespaceIndentation = [BjoernKeywords.Scenario];
    var keywordLines: Line[] = document.getText().split("\n").map((l, index) => new Line(index, l)).filter(l => !l.text.startsWith("#") && !isBlank(l.text));
    keywordLines.forEach(element => {
      if (noWhitespaceIndentation.find(keyword => element.text.startsWith(keyword.toString()))) {
        this.checkIndentationOfLine(0, document, element, diagnostics);
      } else if (twoWhitespaceIndentation.find(keyword => element.text.startsWith(keyword.toString()))) {
        this.checkIndentationOfLine(2, document, element, diagnostics);
      }
    });
  }

  checkIndentationOfLine(expectedIndentations: number, document: vscode.TextDocument, element: Line, diagnostics: vscode.Diagnostic[]) {
    if (document.lineAt(element.lineNumber).firstNonWhitespaceCharacterIndex !== expectedIndentations) {
      var beginPosition = new vscode.Position(element.lineNumber, 0);
      var keywordEnd = document.lineAt(element.lineNumber).firstNonWhitespaceCharacterIndex;
      var endPosition = new vscode.Position(element.lineNumber, keywordEnd);
      diagnostics.push({
        message: 'Indentation not correct. Expected ' + expectedIndentations + ' whitespaces but found ' + keywordEnd,
        range: new vscode.Range(beginPosition, endPosition),
        severity: vscode.DiagnosticSeverity.Error,
      });
    }
  }

  checkFeatureKeyword(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]) {
    if (!document.getText().trim().startsWith(BjoernKeywords.Feature.toString())) {
      diagnostics.push({
        message: 'Specification must start with the keyword "Feature"',
        range: document.lineAt(0).range,
        severity: vscode.DiagnosticSeverity.Error,
      });
    }
  }


  checkWhitespaceBeforeEveryStatement(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]) {
    var statements: Line[] = document.getText().split("\n").map((l, index) => new Line(index, l)).filter(l => l.text.startsWith("-"));
    statements.forEach(element => {
      this.checkWhitspaceBeforeSingleStatement(element, document, diagnostics);
    });
  }

  checkKeywords(document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]) {
    var keywordLines: Line[] = document.getText().split("\n").map((l, index) => new Line(index, l)).filter(l => !l.text.startsWith("-") && !l.text.startsWith("#") && !isBlank(l.text));
    keywordLines.forEach(element => {
      this.checkSingleKeyword(element, document, diagnostics);
    })
  }

  checkSingleKeyword(keyword: Line, document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]) {
    var keywords: string[] = [BjoernKeywords.Feature.toString(), "Given", "When", "Then", BjoernKeywords.Background.toString(), BjoernKeywords.Scenarios.toString()];
    if (!keywords.find(element => keyword.text.startsWith(element))) {
      var documentLine = document.lineAt(keyword.lineNumber);
      var startIndex = documentLine.firstNonWhitespaceCharacterIndex;
      var beginPosition = new vscode.Position(keyword.lineNumber, startIndex);
      var endIndex = documentLine.text.trimLeft().indexOf(" ");
      var endPosition = new vscode.Position(keyword.lineNumber, startIndex + endIndex);
      diagnostics.push({
        message: 'Expected one of the Keywords: ' + keywords.join(", ") + ". Keep in mind that this check is case-sensitive.",
        range: new vscode.Range(beginPosition, endPosition),
        severity: vscode.DiagnosticSeverity.Error,
      });
    }
  }

  checkWhitspaceBeforeSingleStatement(statement: Line, document: vscode.TextDocument, diagnostics: vscode.Diagnostic[]) {
    if (!statement.text.startsWith("- ")) {
      var hyphen = document.lineAt(statement.lineNumber).firstNonWhitespaceCharacterIndex;
      var beginPosition = new vscode.Position(statement.lineNumber, hyphen);
      var endPosition = new vscode.Position(statement.lineNumber, hyphen + 1);
      diagnostics.push({
        message: 'Hyphen - must be followed by a whitespace',
        range: new vscode.Range(beginPosition, endPosition),
        severity: vscode.DiagnosticSeverity.Error,
      });
    }
  }


}

export class Line {
  lineNumber: number;
  text: string;

  constructor(lineNumber: number, text: string) {
    this.text = text.trimLeft();
    this.lineNumber = lineNumber;
  }
}

function isBlank(str: string) {
  return (!str || /^\s*$/.test(str));
}
