import Helper from "../helper";
import * as vscode from "vscode";

export default function definationProvider(config: Helper) {
  const provideDefinition = (document: vscode.TextDocument, position: vscode.Position) => {
    const word = document.getText(document.getWordRangeAtPosition(position));
    const _class = config?.classes.find((c) => word.includes(c.class));
    const _variableValue = config?.variableValueMap[word];
    const _variable = config?.variableMap[word];
    if (!_class && !_variable && !_variableValue) return;
    const file = _class?.path || _variableValue?.path || _variable?.path;
    const line = _class?.line || _variableValue?.line || _variable?.line;
    const location = new vscode.Location(vscode.Uri.file(file), new vscode.Position(line, 0));
    return [location];
  };
  const provider = vscode.languages.registerDefinitionProvider("less", {
    provideDefinition,
  });
  return provider;
}
