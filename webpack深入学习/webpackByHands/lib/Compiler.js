const path = require('path')
const fs = require('fs')
let parser = require('@babel/parser');
let traverse = require('@babel/traverse').default;
let t = require('@babel/types')
let generate = require('@babel/generator').default;
let ejs = require('ejs');
let {SyncHook} = require('tapable')
//babylon 将源码转换成AST语法树
//babel-traverse 遍历AST节点
//babel-types 转换节点
//babel-generator 将替换的节点生成
class Compiler{
   constructor(config){
       this.config = config
       //保存入口文件路径
       this.entryId;
       //保存所有文件的模块依赖
       this.modules = {}
       this.entry = config.entry;//入口文件
       this.root = process.cwd();//工作路径，绝对路径根目录
       this.hooks = {
           entryOption:new SyncHook(),
           compile : new SyncHook(),
           afterCompiler: new SyncHook(),
           afterPlugins:new SyncHook(),
           run:new SyncHook(),
           emit:new SyncHook(),
           done:new SyncHook(),
       }
       let plugins = this.config.plugins;
       if(Array.isArray(plugins))
        {
              plugins.forEach(plugin=>{
                  plugin.apply(this)
             })
        }
        this.hooks.afterPlugins.call()
   }
   getSource(modulePath){
       let rules = this.config.module.rules; 
       let content = fs.readFileSync(modulePath,'utf-8')
       for(let i =0;i<rules.length;i++){
           let rule = rules[i]
           let {test,use} = rule;
           let len = use.length - 1;
           if(test.test(modulePath)){
               function normalLoader(){
                   let loader = require(use[len--]) 
                   content = loader(content)
                   if(len>=0){
                    normalLoader()
                   } 
               }
               normalLoader();
           }
       }
     
       return content
   }

parse(source,parentPath){//AST解析语法树
   let ast = parser.parse(source,{
    sourceType:'module'
   });
   let dependencies = [];
   traverse(ast,{
       CallExpression(p){//调用表达式，函数的执行 a(),require()等
          let node = p.node
          
          if(node.callee.name === 'require'){
               node.callee.name = '__webpack_require__';
               let moduleName = node.arguments[0].value;
               moduleName = moduleName + (path.extname(moduleName)?'':'js')
               moduleName = './'+path.join(parentPath,moduleName) // 'src/a.js'
               dependencies.push(moduleName);
               node.arguments = [t.stringLiteral(moduleName)]
            }
       }
   })
   let sourceCode = generate(ast).code;
   return {sourceCode,dependencies}
}

   //构建模块
   buildModule(modulePath,isEntry){
      let source = this.getSource(modulePath)
      let moduleName = './'+ path.relative(this.root,modulePath)//相对路径 to - from ./src/index.js
      if(isEntry) this.entryId = moduleName; //保存入口的名字
      //将源码解析，并返回依赖列表
      let {sourceCode,dependencies}=this.parse(source,path.dirname(moduleName))//拿到父路径 ./src
      this.modules[moduleName] = sourceCode;
      dependencies.forEach(dp=>{
          this.buildModule(path.join(this.root,dp),false)
      })
   }
   emitFile(){//发射文件
      //用数据渲染
     let main =  path.join(this.config.output.path,this.config.output.filename)
     this.assets = {}
     let templateStr = this.getSource(path.join(__dirname,'main.ejs'))
     let code = ejs.render(templateStr,{entryId:this.entryId,modules:this.modules})
     this.assets[main] = code;
     fs.writeFileSync(main,this.assets[main])
    }
   run(){
       //执行,并且创建模块的依赖关系
       this.hooks.run.call()
       this.hooks.compile.call()
       this.buildModule(path.resolve(this.root,this.entry),true);
       this.hooks.afterCompiler.call()
       //打包后的文件
       this.hooks.emit.call();
       this.emitFile();
       this.hooks.done.call()

   }

}
module.exports = Compiler