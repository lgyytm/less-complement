import Helper from "../helper";
import * as vscode from "vscode";

export default function codelenProvider(config: Helper) {
  const provideCodeLenses = (document: vscode.TextDocument, token: vscode.CancellationToken) => {
    const text = document.getText();
    const codeLenses = [];
    try {
      for (const value of Object.keys(config?.variableValueMap)) {
        const variableMatches = text.matchAll(new RegExp(value, "g"));
        for (const variableMatch of variableMatches) {
          const variable = config.variableValueMap[value].variable;
          if (variableMatch?.index !== undefined && variableMatch?.index > -1) {
            const line = document.lineAt(document.positionAt(variableMatch?.index).line);
            const indexOf = line.text.indexOf(variableMatch[0]);
            const position = new vscode.Position(line.lineNumber, indexOf);
            const range = document.getWordRangeAtPosition(position, new RegExp(value));
            if (range) {
              const codelen = new vscode.CodeLens(range);
              codelen.command = {
                title: `当前值${value}可替换的变量为${config.variableValueMap[value].variable}, 点击替换`,
                command: "less-complement-helper.replace",
                arguments: [value, variable, line, position, range],
              };
              codeLenses.push(codelen);
            }
          }
        }
      }
      return codeLenses;
    } catch (e) {
      return [];
    }
  };
  const provider = vscode.languages.registerCodeLensProvider("less", {
    provideCodeLenses,
  });
  return provider;
}
