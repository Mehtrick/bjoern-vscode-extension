import * as vscode from "vscode";

export class BjoernHighlightProvider implements vscode.DocumentHighlightProvider{

    provideDocumentHighlights(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): vscode.ProviderResult<vscode.DocumentHighlight[]> {
        var items: vscode.DocumentHighlight[] = [];
        var ranges:vscode.Range[] = this.getRanges(document,position);
        ranges.forEach(r => {
            items.push(new vscode.DocumentHighlight(r,vscode.DocumentHighlightKind.Write));
        })
        return items;
    }

    getRanges(document:vscode.TextDocument, position: vscode.Position){
        var lineText=document.lineAt(position).text.replace(/"(.*?)"/g, '""').trim();
        var equallines:number[] = []
        var highlightRanges:vscode.Range[] =[]
        document.getText().replace(/"(.*?)"/g, '""').split("\n").map(s=>s.trim()).forEach((s,index) => {
            if(s === lineText && s.startsWith("-")){
                equallines.push(index);
            }
        });
        var highlightLines:Set<number> = new Set(equallines);

        
       highlightLines.forEach(h => {
            var beginningPosition = new vscode.Position(h,document.lineAt(h).firstNonWhitespaceCharacterIndex);
            var endPosition = document.lineAt(h).range.end;
            var statementRange = new vscode.Range(beginningPosition,endPosition);
            highlightRanges.push(statementRange);
       });

       return highlightRanges;
    }

}