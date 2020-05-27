let babel = require('@babel/core');
const loaderUtils = require('loader-utils');
const mime = require('mime');
function loader(source){
    let {limit} = loaderUtils.getOptions(this);
    if(limit && limit > source.length){
        return `module.exports = "data:${mime.getType(this.resourcePath)};base64,${source.toString('base64')}"`
    }else{
        return require('./file-loader').call(this,source)
    }
   
}
loader.raw = true;//拿到的source是字符串，要转换为二进制buffer
module.exports = loader;