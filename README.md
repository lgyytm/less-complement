# less-complement-helper README

扩展 “less-complement-helper”
your extension "less-complement-helper".

> 非自动识别每个less文件，而是识别每个less入口文件，可以支持多个
> not auto scaning every less files, it's analyzing every entry less files, supporting muilty entries.

## Features

自动补全less的变量以及class
auto provide less's variables and classNames's complements;

## Extension 

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

This extension contributes the following settings:

* `less-complement-helper.enable`: enable/disable this extension
* `less-complement-helper.thing`: set to `blah` to do something

## Using

添加`.lessvhrc`、 `lessvhrc.js`、 `lessvhrc.json`文件。内部配置如下：
``` {
  "alias": {
    // 变量指向
   "@/": "./"
  },
  // 识别less入口, 支持数组（array）
  "entry": "./index.less"
}
```

