import Helper from "./helper";
import * as vscode from "vscode";
import VariableHoverProvider from "./providers/variable-hover-provider";
import ClassHoverProvider from "./providers/class-hover-provider";
import definationProvider from "./providers/defination";
import codelenProvider from "./providers/codelen";
import ClassProvider from "./providers/class-provider";
import VariableValueProvider from "./providers/variable-value-provider";
import VariableProvider from "./providers/variable-provider";

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
    // 变量自动补全
    this.pushVaribales();
    // 变量值自动补全
    this.pushVaribalesValue();
    // 类名自动补全
    this.pushClassName();
    // 定义来源
    this.pushDefinationProviderValue();
    // codelen
    this.pushCodelen();
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
  pushCodelen() {
    const t = this;
    const codelen = codelenProvider(t.config);
    t.context?.subscriptions?.push(codelen);
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
