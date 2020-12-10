import { BjoernKeywords } from "./BjoernKeywords";

export class BjoernKeywordsIndentation {
    bjoenKeyword : BjoernKeywords
    indentation : number;
    indentationInScenarios: number;

    constructor(bjoenKeyword: BjoernKeywords,indentation: number, indentationInScenarios: number) {
        this.bjoenKeyword = bjoenKeyword;
        this.indentation = indentation;
        this.indentationInScenarios = indentationInScenarios
    }

    static readonly Feature = new BjoernKeywordsIndentation(BjoernKeywords.Feature,0,0);
    static readonly Background = new BjoernKeywordsIndentation(BjoernKeywords.Background,0,0);
    static readonly Scenarios = new BjoernKeywordsIndentation(BjoernKeywords.Scenarios,0,0);
    static readonly Scenario = new BjoernKeywordsIndentation(BjoernKeywords.Scenario,2,2);
    static readonly Given = new BjoernKeywordsIndentation(BjoernKeywords.Given,2,4);
    static readonly When = new BjoernKeywordsIndentation(BjoernKeywords.When,4,4);
    static readonly Then = new BjoernKeywordsIndentation(BjoernKeywords.Then,4,4);
    static readonly Statement = new BjoernKeywordsIndentation(BjoernKeywords.Statement,4,6);

    static readonly AllValues = [
        BjoernKeywordsIndentation.Feature,
        BjoernKeywordsIndentation.Background,
        BjoernKeywordsIndentation.Scenarios,
        BjoernKeywordsIndentation.Scenario,
        BjoernKeywordsIndentation.Given,
        BjoernKeywordsIndentation.When,
        BjoernKeywordsIndentation.Then,
        BjoernKeywordsIndentation.Statement
    ]
}
