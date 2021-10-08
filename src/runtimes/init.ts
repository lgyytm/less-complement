import initialyze from "./config-init";
import InputComplement from "./complement";
import * as vscode from "vscode";

const init = async (context: vscode.ExtensionContext) => {
  const instance = await initialyze(context);
  if (instance) {
    const variableHelper = new InputComplement({
      config: instance,
      context,
    });
    return variableHelper;
  }
  return null;
};
export default init;
