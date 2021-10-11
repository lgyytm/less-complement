import * as vscode from "vscode";
import * as path from "path";
import * as fs from "fs";
import * as readline from "readline";

export const getFile = (_path: string) => {
  return new Promise<any>((resolve) => {
    try {
      return fs.readFile(getRealFilePath(_path), "utf8", (err, data) => {
        if (err) {
          resolve(null);
        }
        resolve(data);
      });
    } catch (e) {
      resolve(null);
    }
  });
};

export const readLine = async (_path: string, cb?: (c: string, l: number) => Promise<any>) => {
  const fileStream = fs.createReadStream(getRealFilePath(_path));
  let lineIndex = 0;
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  for await (const line of rl) {
    if (cb) {
      await cb(line, lineIndex);
      lineIndex++;
    }
  }
  return;
};

export const getRealFilePath = (_path: string) => {
  try {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) return "";
    return path.join(workspaceFolders[0].uri.fsPath, _path);
  } catch (e) {
    return "";
  }
};
