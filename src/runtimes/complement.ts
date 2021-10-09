import Helper from "./helper";
import * as vscode from "vscode";

export default class InputComplement {
  config?: Helper;
  context?: vscode.ExtensionContext;
  constructor({ config, context }: { config: Helper; context: vscode.ExtensionContext }) {
    this.config = config;
    this.context = context;
    this.runComplement();
    this.provideVaribalesCompletionItems = this.provideVaribalesCompletionItems.bind(this);
    this.provideClassCompletionItems = this.provideClassCompletionItems.bind(this);
  }
  runComplement() {
    const context = this.context;
    if (!context) return;
    this.pushInput();
  }
  pushInput() {
    this.pushVaribales();
    this.pushClassName();
  }
  pushVaribales() {
    const t = this;
    const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) =>
      t.provideVaribalesCompletionItems.call(t, document, position);
    const provideHover = (document: vscode.TextDocument, position: vscode.Position) =>
      t.varibalesHoverProvider.call(t, document, position);
    const provider = vscode.languages.registerCompletionItemProvider(
      "less",
      {
        provideCompletionItems,
      },
      "@" // triggered whenever a '@' is being typed
    );
    this.context?.subscriptions?.push(provider);
    const hoverProvider = vscode.languages.registerHoverProvider("less", {
      provideHover,
    });
    this.context?.subscriptions?.push(hoverProvider);
  }
  varibalesHoverProvider(document: vscode.TextDocument, position: vscode.Position) {
    const word = document.getText(document.getWordRangeAtPosition(position));
    if (this.config?.variableMap[word]) {
      return new vscode.Hover(`${word}: ${this.config?.variableMap[word]}`);
    }
  }
  provideVaribalesCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    // get all text until the `position` and check if it reads `console.`
    // and if so then complete if `log`, `warn`, and `error`
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    if (!linePrefix.endsWith("@")) {
      return undefined;
    }
    const complements = Object.entries(this.config?.variableMap || {}).map((i) => {
      // a completion item that can be accepted by a commit character,
      // the `commitCharacters`-property is set which means that the completion will
      // be inserted and then the character will be typed.
      const isColor =
        i[1].startsWith("#") || i[1].toLowerCase().startsWith("rgb") || i[1].toLowerCase().startsWith("hls");
      const type = isColor ? vscode.CompletionItemKind.Color : vscode.CompletionItemKind.Variable;
      const completion = new vscode.CompletionItem(`${i[0]}`, type);
      completion.detail = i[1];
      completion.documentation = i[1];
      return completion;
    });
    return [...complements];
  }
  pushClassName() {
    const t = this;
    const provideCompletionItems = (document: vscode.TextDocument, position: vscode.Position) =>
      t.provideClassCompletionItems.call(t, document, position);
    const provider = vscode.languages.registerCompletionItemProvider(
      "less",
      {
        provideCompletionItems,
      },
      "." // triggered whenever a '.' is being typed
    );
    this.context?.subscriptions.push(provider);
  }
  provideClassCompletionItems(document: vscode.TextDocument, position: vscode.Position) {
    const t = this;
    // get all text until the `position` and check if it reads `console.`
    // and if so then complete if `log`, `warn`, and `error`
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    if (!linePrefix.endsWith(".")) {
      return undefined;
    }
    const complements =
      t.config?.classes?.map((i) => {
        const CompletionItemLabel: vscode.CompletionItemLabel = {
          label: `${i.class}`,
        };
        const complement = new vscode.CompletionItem(CompletionItemLabel, vscode.CompletionItemKind.Variable);
        complement.detail = i.detail;
        return complement;
      }) || [];
    return [...complements];
  }
}
