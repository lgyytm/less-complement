import Helper from "../helper";
import * as vscode from "vscode";

export default function ClassProvider(config: Helper) {
  const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) => {
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    if (!linePrefix.endsWith(".")) {
      return undefined;
    }
    const complements =
      config?.classes?.map((i) => {
        const CompletionItemLabel: vscode.CompletionItemLabel = {
          label: `${i.class}`,
        };
        const complement = new vscode.CompletionItem(CompletionItemLabel, vscode.CompletionItemKind.Variable);
        complement.detail = i.detail;
        complement.insertText = `${i.class}();`;
        return complement;
      }) || [];
    return [...complements];
  };
  const provider = vscode.languages.registerCompletionItemProvider(
    "less",
    {
      provideCompletionItems,
    },
    "." // triggered whenever a '.' is being typed
  );
  return provider;
}
