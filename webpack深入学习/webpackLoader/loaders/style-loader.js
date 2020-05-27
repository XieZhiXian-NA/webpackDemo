let loaderUtils = require('loader-utils')

function loader(source){
  
}
// css-loader.js!less-loader.js!D:\eletron\webpackLoader\src\index.less
loader.pitch = function(remainingRequest){
    //remainingRequest剩余的loader
    //让style-loader去处理剩余的loader
    //只需要使用内联来处理loader
    //以index.js的路径为基础将绝对路径转为相对路径"!!../loaders/css-loader.js!../loaders/less-loader.js!./index.less"
    let str = `
    let style = document.createElement('style')
    style.innerHTML = require(${loaderUtils.stringifyRequest(this,'!!'+remainingRequest)}) 
    document.head.appendChild(style);
 `
 return str
}
module.exports = loader