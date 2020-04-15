const loaderUtils = require('loader-utils')
module.exports =function(source){
    const options = loaderUtils.getOptions(this)
    //console.log(options)
    //this.callback(null,result)
    const cb = this.async()//处理异步代码 返回的值就是callback
    setTimeout(()=>{
         const result =source.replace('你好',options.name)
         cb(null,result) 
    },1000)
}