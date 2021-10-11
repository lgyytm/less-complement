import Helper from "./helper";
import * as vscode from "vscode";
import path = require("path");

export default function VariableHoverProvider(config: Helper) {
  const provideHover = (document: vscode.TextDocument, position: vscode.Position) => {
    const word = document.getText(document.getWordRangeAtPosition(position));
    const base = path.basename(config?.variableMap[word].path);
    if (config?.variableMap[word]) {
      const hover = new vscode.Hover(
        `变量(variable): ${word};\r\n` +
          `值(value): ${config?.variableMap[word].value};\r\n` +
          `来源(from): [${base}](${config?.variableMap[word].path});\r\n`
      );
      return hover;
    }
  };
  const provider = vscode.languages.registerHoverProvider("less", {
    provideHover,
  });
  return provider;
}
