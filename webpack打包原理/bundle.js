const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')
const entry=(filename)=>{
  const content = fs.readFileSync(filename,'utf-8')
  //通过parse能分析到源代码每一行代码的类型 
  const Ast = parser.parse(content,{
      sourceType:'module'
  })
  //dp:{'./a.js':'./src/a.js'}
  const dp ={} 
  // traverse and update nodes:
  traverse(Ast,{
      //将语法书的import类型的拿出来 import a from './a.js'
      ImportDeclaration({node}){
            // xxxx.value值拿到的是./a.js
            const sv = node.source.value
            
            const dirname= path.dirname(filename)
           
            //达到文件在项目中的具体路径'./src/a.js'
            const newfile ='./'+path.join(dirname,node.source.value)
             dp[sv]=newfile
           
      }
  })
  const {code} = babel.transformFromAst(Ast,null,{
      presets:["@babel/preset-env"] //将抽象语法树转化为js 将import-->转化为require
  })
  return {
      filename,
      dp,
      code
  }
}
//递归遍历啊，a.js b.js
const deepModule = (filename)=>{
   const entryInfo = entry(filename)
   const deepModuleArry = [entryInfo]
   for(let i=0;i<deepModuleArry.length;i++){
       const item = deepModuleArry[i]
       const {dp} = item
       if(dp){
           for(let key in dp){
               deepModuleArry.push(entry(dp[key])) 
           }
       }

   }
  const graph ={}
  deepModuleArry.forEach(item=>{
      graph[item.filename]={
          dp:item.dp,
          code:item.code
      }
  })
  return graph
}

const code = (filename)=>{
       const dpall = JSON.stringify(deepModule(filename))  
       return `
          (function(dpall){ 
           
            function require(module){

                  function localRequire(relativePath){
                  return require(dpall[module].dp[relativePath]) 
                }
                  var exports ={};
                  (function(require,exports,code){
                      eval(code)
                    })(localRequire,exports,dpall[module].code)
                  return exports;
            }
            require('${filename}')
          })(${dpall})
       `   
}
const info = code('./src/index.js')
console.log(info)