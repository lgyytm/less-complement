import Helper from "./helper";
import * as vscode from "vscode";

export default function VariableProvider(config: Helper) {
  const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) => {
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    if (!linePrefix.endsWith("@")) {
      return undefined;
    }
    const complements = Object.entries(config?.variableMap || {}).map((i) => {
      const isColor =
        i[1].value.startsWith("#") ||
        i[1].value.toLowerCase().startsWith("rgb") ||
        i[1].value.toLowerCase().startsWith("hls");
      const type = isColor ? vscode.CompletionItemKind.Color : vscode.CompletionItemKind.Variable;
      const completion = new vscode.CompletionItem(`${i[0]}`, type);
      completion.detail = i[1].value;
      completion.documentation = i[1].value;
      return completion;
    });
    return [...complements];
  };
  const provider = vscode.languages.registerCompletionItemProvider(
    "less",
    {
      provideCompletionItems,
    },
    "@" // triggered whenever a '@' is being typed
  );
  return provider;
}
