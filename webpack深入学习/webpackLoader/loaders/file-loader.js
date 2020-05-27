let babel = require('@babel/core');
const loaderUtils = require('loader-utils');
function loader(source){//根据源码生成一个md5戳
    let filename = loaderUtils.interpolateName(this,'[hash].[ext]',{content:source})
    this.emitFile(filename,source);//告诉 webpack 我需要创建一个文件，webpack会根据参数创建对应的文件，放在 public path 目录下。
    return `module.exports = "${filename}"`
}
loader.raw = true;//拿到的source是字符串，要转换为二进制buffer
module.exports = loader;