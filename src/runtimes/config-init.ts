import * as vscode from "vscode";
import { getFile } from "./file";
import Helper from "./helper";

export interface CONFIG {
  alias: { [k: string]: string };
  exclude: string[];
  entry: string;
}

// 获取基础配置信息
const configFetch = async (context: vscode.ExtensionContext): Promise<CONFIG | null> => {
  const configArr = [getFile(".lessvhrc"), getFile("lessvhrc.js"), getFile("lessvhrc.json")];
  let config: null | CONFIG = null;
  for (const i of configArr) {
    let conf = await i;
    if (conf === null) {
      continue;
    } else {
      try {
        config = JSON.parse(conf);
      } catch (e) {
        console.log("初始化文件非JSON格式");
      }
      break;
    }
  }
  return config;
};

// 配置初始化
const initialyze = async (context: vscode.ExtensionContext) => {
  const config = await configFetch(context);
  if (config === null) {
    return;
  }
  const helper = new Helper({ config });
  await helper.init();
  return helper;
};

export default initialyze;
