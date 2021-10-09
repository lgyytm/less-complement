import path = require("path");
import { CONFIG } from "./config-init";
import { readLine } from "./file";

export default class Helper {
  alias: { [k: string]: string } = {};
  entry: string | string[] = "";
  variableMap: { [k: string]: string } = {};
  holdingStr = "";
  classes: { class: string; detail: string }[] = [];
  constructor({ config }: { config: CONFIG }) {
    const { alias = {}, entry = "" } = config;
    if (Object.prototype.toString.call(alias) === "[object Object]") {
      this.alias = alias;
    }
    if (typeof entry === "string" && entry.endsWith(".less")) {
      this.entry = entry;
    }
    if (Array.isArray(entry)) {
      this.entry = entry.filter((i) => {
        if (typeof i === "string" && i.endsWith(".less")) {
          return true;
        }
        return false;
      });
    }
    if (!this.entry) {
      return;
    }
  }
  async init() {
    const entryPath = ".";
    if (Array.isArray(this.entry)) {
      this.entry = this.entry.map((i) => this.aliasReplace(i, entryPath));
    } else {
      this.entry = this.aliasReplace(this.entry, entryPath);
    }
    await this.initialyze(entryPath);
  }
  /**
   * 替换别名
   * @param str string 原始string
   * @returns 替换别名结果
   */
  aliasReplace(str: string, relativePath: string) {
    const alias = Object.keys(this.alias);
    if (alias.length === 0) {
      return str;
    }
    let isContainAlias = false;
    for (const alia of alias) {
      if (str.includes(alia)) {
        isContainAlias = true;
      }
      str = str.replace(alia, this.alias[alia]);
    }
    if (!isContainAlias) {
      str = path.join(relativePath, str);
    }
    return str;
  }
  /**
   * 解析文件
   */
  async initialyze(relativePath: string) {
    if (Array.isArray(this.entry)) {
      this.entry = this.entry.map((i) => this.aliasReplace(i, relativePath));
      for (const i of this.entry) {
        await this.processFile(i);
      }
    } else {
      await this.processFile(this.entry);
    }
  }
  /**
   * 处理文件
   * @param file string 文件路径
   */
  async processFile(file: string) {
    const relativePath = path.dirname(file);
    await readLine(file, async (lineContent) => {
      await this.analyze(lineContent, relativePath);
    });
  }
  /**
   * 分析less内容
   * @param content string 内容
   */
  async analyze(content: string, relativePath: string) {
    switch (true) {
      case content.startsWith("@import"):
        await this.initialyzeChildFile(content, relativePath);
        break;
      case content.startsWith("."):
        this.initialyzeClassName(content);
        break;
      case content.startsWith("@"):
        this.initialyzeVariable(content);
        break;
      default:
        if (this.holdingStr) {
          this.initialyzeClassName(content);
        }
        break;
    }
  }
  /**
   * 处理引入文件
   * @param content string 内容
   */
  async initialyzeChildFile(content: string, relativePath: string) {
    const fileReg = /["'](.+.less)['"]/gi;
    const result = fileReg.exec(content);
    if (result) {
      const file = this.aliasReplace(result[1], relativePath);
      await this.processFile(file);
    }
  }
  /**
   * 处理class name
   * @param content string 内容
   */
  initialyzeClassName(content: string) {
    if (content.startsWith(".") && this.holdingStr) {
      const classNameReg = /(.[\w-]+)([\s\S]+)?/gi;
      const result = classNameReg.exec(this.holdingStr);
      if (result) {
        const className = result[1] ?? "";
        const detail = result[2] ?? "";
        if (className) {
          this.classes.push({ class: className, detail });
          this.holdingStr = content;
        }
      }
    } else if (!content.startsWith(".") && this.holdingStr) {
      this.holdingStr += `\r${content}`;
    } else if (content.startsWith(".") && !this.holdingStr) {
      this.holdingStr += `${content}`;
    }
  }
  /**
   * 处理变量
   * @param content string 内容
   */
  initialyzeVariable(content: string) {
    const variableReg = /(@[\w]+)\s?:\s?([^;]+);/gi;
    const result = variableReg.exec(content);
    let variable, value;
    if (result) {
      variable = result[1];
      value = result[2];
      this.variableMap[variable] = value;
    }
  }
}
