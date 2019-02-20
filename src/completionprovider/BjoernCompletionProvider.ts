import * as vscode from "vscode";

export class BjoernCompletionProvider implements vscode.CompletionItemProvider {
  provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken
  ) {
    var items: vscode.CompletionItem[] = [];
    if (this.lineShouldGetAutocomplete(document, position)) {
      this.searchForAutocompleteStatements(document, position, items);
    }
    return items;
  }

  private searchForAutocompleteStatements(document: vscode.TextDocument, position: vscode.Position, items: vscode.CompletionItem[]) {
    var keyword: BDD = new KeywordSectionFinder().getKeywordSection(document, position);
    var statements: BDDStatement[] = this.parseStatements(document);
    statements = statements.filter(s => {
      return s.keyword === keyword;
    });
    statements.forEach(element => {
      items.push(new vscode.CompletionItem(element.statement, vscode.CompletionItemKind.Text));
    });
  }

  parseStatements(document: vscode.TextDocument) {
    var finder: KeywordSectionFinder = new KeywordSectionFinder;
    var documentLines: BDDStatement[] = document.getText().split("\n")
      .map((s, index) => {
        var bddKeyword: BDD = finder.getKeywordSection(document, new vscode.Position(index, 0));
        return new BDDStatement(bddKeyword, s);
      }).filter(this.filterStatement)
      .map(s => {
        s.statement = s.statement.replace("-", "");
        return s;
      })
      .filter((s, index, self) => {
        return index === self.findIndex((t) => (
          t.keyword === s.keyword && t.statement === s.statement
        ));
      });
    return documentLines;
  }

  filterStatement(element: BDDStatement) {
    return element.keyword !== BDD.Undefined && element.statement.startsWith("-") && !element.statement.includes("Scenario");
  }

  lineShouldGetAutocomplete(document: vscode.TextDocument, position: vscode.Position): boolean {
    let line = document.lineAt(position.line);
    return line.text.trimLeft().startsWith("-") && !line.text.includes("- Scenario");
  }
}

export enum BDD {
  Given, When, Then, Undefined
}

export class BDDStatement {

  keyword: BDD;
  statement: string;

  constructor(keyword: BDD, statement: string) {
    this.keyword = keyword;
    this.statement = statement.replace(/"(.*?)"/g, '""').trim();
  }

}

export class KeywordSectionFinder {
  getKeywordSection(document: vscode.TextDocument, position: vscode.Position): BDD {
    let text = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
    let givenIndex = text.lastIndexOf("Given");
    let whenIndex = text.lastIndexOf("When");
    let thenIndex = text.lastIndexOf("Then");

    var highestIndex = Math.max(givenIndex, whenIndex, thenIndex);
    switch (highestIndex) {
      case givenIndex: {
        return BDD.Given;
      }
      case whenIndex: {
        return BDD.When;
      }
      case thenIndex: {
        return BDD.Then;
      }
      default: {
        return BDD.Undefined;
      }
    }
  }
}
