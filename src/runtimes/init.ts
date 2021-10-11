import initialyze from "./config-init";
import InputComplement from "./complement";
import * as vscode from "vscode";
import Commands from "./commands";

const init = async (context: vscode.ExtensionContext) => {
  const instance = await initialyze(context);
  if (instance) {
    new Commands();
    const variableHelper = new InputComplement({
      config: instance,
      context,
    });
    return variableHelper;
  }
  return null;
};
export default init;
