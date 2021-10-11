import Helper from "../helper";
import * as vscode from "vscode";
import path = require("path");

export default function ClassHoverProvider(config: Helper) {
  const provideHover = (document: vscode.TextDocument, position: vscode.Position) => {
    const word = document.getText(document.getWordRangeAtPosition(position));
    const _class = config?.classes.find((c) => word.includes(c.class));
    if (!_class) return;
    const base = path.basename(_class.path);
    const hover = new vscode.Hover(
      `变量(variable): ${word};\r\n \n` +
        `值(value): ${_class.detail};\r\n \n` +
        `来源(from): [${base}](${_class.path});\r\n \n`
    );
    return hover;
  };
  const provider = vscode.languages.registerHoverProvider("less", {
    provideHover,
  });
  return provider;
}
