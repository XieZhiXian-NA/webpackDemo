let babel = require('@babel/core');
const loaderUtils = require('loader-utils');
function loader(source){//this,loader上下文
    let options = loaderUtils.getOptions(this);
    let cb = this.async()
    babel.transform(source,{
        ...options,
        sourceMaps:true,
        filename:this.resourcePath.split('/').pop()//文件名,当前处理的文件的绝对路径
    },function(err,result){
       cb(err,result.code,result.map)//异步的
    })
}
module.exports = loader;