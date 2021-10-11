import Helper from "../helper";
import * as vscode from "vscode";

export default function VariableValueProvider(config: Helper) {
  const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) => {
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    const valuesEntries = Object.entries(config?.variableValueMap || {});
    const hasValuesReg = (value: string) => {
      return new RegExp(`${value.split("").join("?") + "?"}$`, "i");
    };
    if (!valuesEntries.some((i) => hasValuesReg(i[0]).test(linePrefix))) {
      return undefined;
    }
    const complements = valuesEntries.map((i) => {
      const type = vscode.CompletionItemKind.Variable;
      const completion = new vscode.CompletionItem(`${i[0]}`, type);
      completion.detail = i[1].variable;
      completion.documentation = i[1].variable;
      completion.insertText = i[1].variable;
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
