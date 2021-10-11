import Helper from "./helper";
import * as vscode from "vscode";
import VariableProvider from "./variable-provider";
import ClassProvider from "./class-provider";
import VariableHoverProvider from "./variable-hover-provider";
import ClassHoverProvider from "./class-hover-provider";
import VariableValueProvider from "./variable-value-provider";
import definationProvider from "./defination";

export default class InputComplement {
  config: Helper;
  context: vscode.ExtensionContext;
  constructor({ config, context }: { config: Helper; context: vscode.ExtensionContext }) {
    this.config = config;
    this.context = context;
    this.runComplement();
  }
  runComplement() {
    const context = this.context;
    if (!context) return;
    this.pushInput();
  }
  pushInput() {
    this.pushVaribales();
    this.pushVaribalesValue();
    this.pushClassName();
    this.pushDefinationProviderValue();
  }
  pushVaribales() {
    const t = this;
    const variableProvider = VariableProvider(t.config);
    const variableHoverProvider = VariableHoverProvider(t.config);
    t.context?.subscriptions?.push(variableProvider);
    t.context?.subscriptions?.push(variableHoverProvider);
  }
  pushVaribalesValue() {
    const t = this;
    const variableValueProvider = VariableValueProvider(t.config);
    t.context?.subscriptions?.push(variableValueProvider);
  }
  pushDefinationProviderValue() {
    const t = this;
    const defination = definationProvider(t.config);
    t.context?.subscriptions?.push(defination);
  }
  pushClassName() {
    const t = this;
    const provider = ClassProvider(t.config);
    const classHoverProvider = ClassHoverProvider(t.config);
    t.context?.subscriptions.push(provider);
    t.context?.subscriptions.push(classHoverProvider);
  }
}
