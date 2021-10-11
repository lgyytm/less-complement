/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const config_init_1 = __webpack_require__(2);
const complement_1 = __webpack_require__(9);
const init = async (context) => {
    const instance = await (0, config_init_1.default)(context);
    if (instance) {
        const variableHelper = new complement_1.default({
            config: instance,
            context,
        });
        return variableHelper;
    }
    return null;
};
exports["default"] = init;


/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const file_1 = __webpack_require__(3);
const helper_1 = __webpack_require__(8);
// 获取基础配置信息
const configFetch = async (context) => {
    const configArr = [(0, file_1.getFile)(".lessvhrc"), (0, file_1.getFile)("lessvhrc.js"), (0, file_1.getFile)("lessvhrc.json")];
    let config = null;
    for (const i of configArr) {
        let conf = await i;
        if (conf === null) {
            continue;
        }
        else {
            try {
                config = JSON.parse(conf);
            }
            catch (e) {
                console.log("初始化文件非JSON格式");
            }
            break;
        }
    }
    return config;
};
// 配置初始化
const initialyze = async (context) => {
    const config = await configFetch(context);
    if (config === null) {
        return;
    }
    const helper = new helper_1.default({ config });
    await helper.init();
    return helper;
};
exports["default"] = initialyze;


/***/ }),
/* 3 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getRealFilePath = exports.readLine = exports.getFile = void 0;
const vscode = __webpack_require__(4);
const path = __webpack_require__(5);
const fs = __webpack_require__(6);
const readline = __webpack_require__(7);
const getFile = (_path) => {
    return new Promise((resolve) => {
        try {
            return fs.readFile((0, exports.getRealFilePath)(_path), "utf8", (err, data) => {
                if (err) {
                    resolve(null);
                }
                resolve(data);
            });
        }
        catch (e) {
            resolve(null);
        }
    });
};
exports.getFile = getFile;
const readLine = async (_path, cb) => {
    const fileStream = fs.createReadStream((0, exports.getRealFilePath)(_path));
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
exports.readLine = readLine;
const getRealFilePath = (_path) => {
    try {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders)
            return "";
        return path.join(workspaceFolders[0].uri.fsPath, _path);
    }
    catch (e) {
        return "";
    }
};
exports.getRealFilePath = getRealFilePath;


/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = require("vscode");

/***/ }),
/* 5 */
/***/ ((module) => {

module.exports = require("path");

/***/ }),
/* 6 */
/***/ ((module) => {

module.exports = require("fs");

/***/ }),
/* 7 */
/***/ ((module) => {

module.exports = require("readline");

/***/ }),
/* 8 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const path = __webpack_require__(5);
const file_1 = __webpack_require__(3);
class Helper {
    constructor({ config }) {
        this.alias = {};
        this.entry = "";
        this.variableMap = {};
        this.variableValueMap = {};
        this.holdingStr = "";
        this.classes = [];
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
        }
        else {
            this.entry = this.aliasReplace(this.entry, entryPath);
        }
        await this.initialyze(entryPath);
    }
    /**
     * 替换别名
     * @param str string 原始string
     * @returns 替换别名结果
     */
    aliasReplace(str, relativePath) {
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
    async initialyze(relativePath) {
        if (Array.isArray(this.entry)) {
            this.entry = this.entry.map((i) => this.aliasReplace(i, relativePath));
            for (const i of this.entry) {
                await this.processFile(i);
            }
        }
        else {
            await this.processFile(this.entry);
        }
    }
    /**
     * 处理文件
     * @param file string 文件路径
     */
    async processFile(file) {
        const relativePath = path.dirname(file);
        await (0, file_1.readLine)(file, async (lineContent, line) => {
            await this.analyze(lineContent, line, relativePath, (0, file_1.getRealFilePath)(file));
        });
    }
    /**
     * 分析less内容
     * @param content string 内容
     */
    async analyze(content, line, relativePath, file) {
        switch (true) {
            case content.startsWith("@import"):
                await this.initialyzeChildFile(content, relativePath);
                break;
            case content.startsWith("."):
                this.initialyzeClassName(content, line, file);
                break;
            case content.startsWith("@"):
                this.initialyzeVariable(content, line, file);
                break;
            default:
                if (this.holdingStr) {
                    this.initialyzeClassName(content, line, file);
                }
                break;
        }
    }
    /**
     * 处理引入文件
     * @param content string 内容
     */
    async initialyzeChildFile(content, relativePath) {
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
    initialyzeClassName(content, line, path) {
        if (content.startsWith(".") && this.holdingStr) {
            const classNameReg = /(.[\w-]+)([\s\S]+)?/gi;
            const result = classNameReg.exec(this.holdingStr);
            if (result) {
                const className = result[1] ?? "";
                const detail = result[2] ?? "";
                if (className) {
                    this.classes.push({ class: className, detail, path, line });
                    this.holdingStr = content;
                }
            }
        }
        else if (!content.startsWith(".") && this.holdingStr) {
            this.holdingStr += `\r${content}`;
        }
        else if (content.startsWith(".") && !this.holdingStr) {
            this.holdingStr += `${content}`;
        }
    }
    /**
     * 处理变量
     * @param content string 内容
     */
    initialyzeVariable(content, line, path) {
        const variableReg = /(@[\w]+)\s?:\s?([^;]+);/gi;
        const result = variableReg.exec(content);
        let variable, value;
        if (result) {
            variable = result[1];
            value = result[2];
            this.variableMap[variable] = { value, path, line };
            this.variableValueMap[value] = { variable, path, line };
        }
    }
}
exports["default"] = Helper;


/***/ }),
/* 9 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const variable_provider_1 = __webpack_require__(10);
const class_provider_1 = __webpack_require__(11);
const variable_hover_provider_1 = __webpack_require__(12);
const class_hover_provider_1 = __webpack_require__(13);
const variable_value_provider_1 = __webpack_require__(14);
const defination_1 = __webpack_require__(15);
class InputComplement {
    constructor({ config, context }) {
        this.config = config;
        this.context = context;
        this.runComplement();
    }
    runComplement() {
        const context = this.context;
        if (!context)
            return;
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
        const variableProvider = (0, variable_provider_1.default)(t.config);
        const variableHoverProvider = (0, variable_hover_provider_1.default)(t.config);
        t.context?.subscriptions?.push(variableProvider);
        t.context?.subscriptions?.push(variableHoverProvider);
    }
    pushVaribalesValue() {
        const t = this;
        const variableValueProvider = (0, variable_value_provider_1.default)(t.config);
        t.context?.subscriptions?.push(variableValueProvider);
    }
    pushDefinationProviderValue() {
        const t = this;
        const defination = (0, defination_1.default)(t.config);
        t.context?.subscriptions?.push(defination);
    }
    pushClassName() {
        const t = this;
        const provider = (0, class_provider_1.default)(t.config);
        const classHoverProvider = (0, class_hover_provider_1.default)(t.config);
        t.context?.subscriptions.push(provider);
        t.context?.subscriptions.push(classHoverProvider);
    }
}
exports["default"] = InputComplement;


/***/ }),
/* 10 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(4);
function VariableProvider(config) {
    const provideCompletionItems = (document, position) => {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith("@")) {
            return undefined;
        }
        const complements = Object.entries(config?.variableMap || {}).map((i) => {
            const isColor = i[1].value.startsWith("#") ||
                i[1].value.toLowerCase().startsWith("rgb") ||
                i[1].value.toLowerCase().startsWith("hls");
            const type = isColor ? vscode.CompletionItemKind.Color : vscode.CompletionItemKind.Variable;
            const completion = new vscode.CompletionItem(`${i[0]}`, type);
            completion.detail = i[1].value;
            completion.documentation = i[1].value;
            return completion;
        });
        return [...complements];
    };
    const provider = vscode.languages.registerCompletionItemProvider("less", {
        provideCompletionItems,
    }, "@" // triggered whenever a '@' is being typed
    );
    return provider;
}
exports["default"] = VariableProvider;


/***/ }),
/* 11 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(4);
function ClassProvider(config) {
    const provideCompletionItems = (document, position) => {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        if (!linePrefix.endsWith(".")) {
            return undefined;
        }
        const complements = config?.classes?.map((i) => {
            const CompletionItemLabel = {
                label: `${i.class}`,
            };
            const complement = new vscode.CompletionItem(CompletionItemLabel, vscode.CompletionItemKind.Variable);
            complement.detail = i.detail;
            return complement;
        }) || [];
        return [...complements];
    };
    const provider = vscode.languages.registerCompletionItemProvider("less", {
        provideCompletionItems,
    }, "." // triggered whenever a '.' is being typed
    );
    return provider;
}
exports["default"] = ClassProvider;


/***/ }),
/* 12 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(4);
const path = __webpack_require__(5);
function VariableHoverProvider(config) {
    const provideHover = (document, position) => {
        const word = document.getText(document.getWordRangeAtPosition(position));
        const base = path.basename(config?.variableMap[word].path);
        if (config?.variableMap[word]) {
            const hover = new vscode.Hover(`变量(variable): ${word};\r\n` +
                `值(value): ${config?.variableMap[word].value};\r\n` +
                `来源(from): [${base}](${config?.variableMap[word].path});\r\n`);
            return hover;
        }
    };
    const provider = vscode.languages.registerHoverProvider("less", {
        provideHover,
    });
    return provider;
}
exports["default"] = VariableHoverProvider;


/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(4);
const path = __webpack_require__(5);
function ClassHoverProvider(config) {
    const provideHover = (document, position) => {
        const word = document.getText(document.getWordRangeAtPosition(position));
        const _class = config?.classes.find((c) => word.includes(c.class));
        if (!_class)
            return;
        const base = path.basename(_class.path);
        const hover = new vscode.Hover(`变量(variable): ${word};\r\n` + `值(value): ${_class.detail};\r\n` + `来源(from): [${base}](${_class.path});\r\n`);
        return hover;
    };
    const provider = vscode.languages.registerHoverProvider("less", {
        provideHover,
    });
    return provider;
}
exports["default"] = ClassHoverProvider;


/***/ }),
/* 14 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(4);
function VariableValueProvider(config) {
    const provideCompletionItems = (document, position) => {
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        const valuesEntries = Object.entries(config?.variableValueMap || {});
        const hasValuesReg = (value) => {
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
    const provider = vscode.languages.registerCompletionItemProvider("less", {
        provideCompletionItems,
    }, "@" // triggered whenever a '@' is being typed
    );
    return provider;
}
exports["default"] = VariableValueProvider;


/***/ }),
/* 15 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
const vscode = __webpack_require__(4);
function definationProvider(config) {
    const provideDefinition = (document, position) => {
        const word = document.getText(document.getWordRangeAtPosition(position));
        const _class = config?.classes.find((c) => word.includes(c.class));
        const _variableValue = config?.variableValueMap[word];
        const _variable = config?.variableMap[word];
        if (!_class && !_variable && !_variableValue)
            return;
        const file = _class?.path || _variableValue?.path || _variable?.path;
        const line = _class?.line || _variableValue?.line || _variable?.line;
        const location = new vscode.Location(vscode.Uri.file(file), new vscode.Position(line, 0));
        return [location];
    };
    const provider = vscode.languages.registerDefinitionProvider("less", {
        provideDefinition,
    });
    return provider;
}
exports["default"] = definationProvider;


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.deactivate = exports.activate = void 0;
const init_1 = __webpack_require__(1);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    (0, init_1.default)(context);
    console.log('"less-complement-helper" is now active!');
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension.js.map