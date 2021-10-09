import * as vscode from "vscode";
/**
 * Provides code actions corresponding to diagnostic problems.
 */
export class VariablesInfo implements vscode.Command {
  title: string = "";
  tooltip?: string;
  command: string = "variables";
  arguments?: any[];
  constructor(props: Partial<vscode.Command>) {
    this.title = props.title ?? "";
    this.tooltip = props.tooltip ?? "";
    this.arguments = props.arguments ?? [];
    this.command = "variables";
  }
}
//  export class VariablesInfo implements vscode.CodeActionProvider {

// 	public static readonly providedCodeActionKinds = [
// 		vscode.CodeActionKind.RefactorExtract
// 	];

// 	provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
// 		// for each diagnostic entry that has the matching `code`, create a code action command
//         return []
// 		// return context.diagnostics
// 		// 	.filter(diagnostic => diagnostic.code === EMOJI_MENTION)
// 		// 	.map(diagnostic => this.createCommandCodeAction(diagnostic));
// 	}

// 	private createCommandCodeAction(diagnostic: vscode.Diagnostic): vscode.CodeAction {
// 		const action = new vscode.CodeAction('Learn more...', vscode.CodeActionKind.QuickFix);
// 		// action.command = { command: COMMAND, title: 'Learn more about emojis', tooltip: 'This will open the unicode emoji page.' };
// 		action.diagnostics = [diagnostic];
// 		action.isPreferred = true;
// 		return action;
// 	}
// }
