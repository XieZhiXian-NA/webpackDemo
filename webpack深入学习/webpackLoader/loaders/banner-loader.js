const loaderUtils = require('loader-utils');
const validateOptions  = require('schema-utils');
const fs = require('fs')
//以验证传递过来的选项
function loader(source){//this,loader上下文
    let options = loaderUtils.getOptions(this);
    let cb = this.async();
     this.cacheable &&  this.cacheable(true);//使加载的结果能缓存
    let schema = {
        type:'object',
        properties:{
            text:{
                type:'string'
            },
            filename:{
                type:'string'
            }
        }
    }
    validateOptions(schema,options,'banner-loader')//两个类型做对比，若出错了，报是哪个loader出错
    if(options.filename){
        this.addDependency(options.filename)
        //添加文件依赖，当配置中使用了watch，则当引入的文件发生了更改，则也可以被webpakc监测到
          fs.readFile(options.filename,'utf-8',(err,data)=>{
              cb(err,`/**${data}**/${source}`)
          })
    }else{
        cb(null,`/**${options.text}**/${source}`)
    }
}
module.exports = loader;