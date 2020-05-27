#! /usr/bin/env node

// 拿到webpack.config.js 找到入口文件

let path = require('path');
let config = require(path.resolve('./webpack.config.js'));
let Compiler = require('../lib/Compiler.js');
let compiler = new Compiler(config);
compiler.hooks.entryOption.call();

//表示运行编译
compiler.run();