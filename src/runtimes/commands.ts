import * as vscode from "vscode";

export default class Commands {
  constructor() {
    this.init();
  }
  init() {
    vscode.commands.registerCommand(
      "less-complement-helper.replace",
      (
        text: string,
        replaceText: string,
        line: vscode.TextLine,
        position: vscode.Position,
        range: vscode.Range
      ) => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
          editor.edit((editBuilder) => {
            editBuilder.replace(range, replaceText);
          });
        }
      }
    );
  }
}
