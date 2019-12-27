### 配置 webpack 打包 react

```js
   配置webpack打包react
   1:安装npm install react react-dom -S
   2:安装babel与react转换的插件 npm install @babel/preset-react
   3:在.babelrc配置  "@bable/preset-react"
   4:修改 test: /\.jsx?$/
   tree Shaking
   1:只支持静态引入的方式 import-->export defalut  动态引入require-->module.exports
   2: --->export const a={} export const b={}
      --->import {a}引入解构出a 虽然没有引入b 但打包时还是会将b模块打包
   3:设置摇树模式
      --->开发模式设置,不会帮助我们把没有引用的代码去掉生产模式，会自动帮助我们摇树，可以不用设置
      webpack.config.js下 optimization:{usedExports:true}
      package.json     "sideEffects":
          --->sideEffects:false对所有模块都进行tree shaking
          --->但是当我们使用import './css/*.js' 或者import @babel/polyfill时 使用Tree Shaking打包时，发现此模块并没有import引入任何的模块
          --->会认为我们并没有使用这个模块 就会不会进行打包 通过设置sideEffects:['@babel/polyfill','./css/*js']将这两个模块排除在外，不使用treeShaking进行打包
          --->在development模式下，即使配置了，tree Shaking也没有真正的生效，它还是会保留没有引入的代码，方便查看报错代码的位置
          --->在production模式下，tree-shaking才会真正的起作用
   配置文件分割
   1.npm install webpack-merge -D
   2.merge(baseConfig,devConfig)
   3.merge(baseConfig,proConfig)
   配置文件 环境变量注入的方式
   module.exports = (env)=>{
     if(env && env.production){
         return merge(baseConfig,proConfig)
     }else{
         return merge(baseConfig,devConfig)
     }}、
   package.json
   "dev": "webpack-dev-server --config ./config/webpack.base.js",
   "build": "webpack  --env.production --config ./config/webpack.base.js"
   codeSpliting
   1.业务代码与第三方库 拆分很必要
     --->体积大，加载时间长
     --->业务逻辑变化，第三库不变，所以业务逻辑一变更，第三方库也要重新加载打包
   optimization:{
   //做代码分割
        splitChunks:{
            chunks:'all', //all 既支持异步也支持同步引入//async 异步引入第三方库 //initial 同步引入第三方库
            minSize:30000，//最小尺寸 只有当模块大于30kb才会被分离出去
            minChunks:x,//模块至少被引入了x次，才会被分割,默认值为1 第三方库只要被一个模块引入了就分割出去
            name:true,//设置打包后的名称功能的开启
            cacheGroups:{
               other:{
                  chunks'initial',
                  test:/react|lodash/,//过滤，只检测react,lodash第三方库
                  name:'other',//打包后的名字,
                  minSize:30000,
                  minChunks:1
               },
               vendors:{
                 test:/[\\/]node_modules[\\/]/,//过滤，检测是否在/node_modules/目录下
                  name:'vendors',//打包后的名字,
                 priority:-10,//缓存组的优先级，数字越大，优先级越高，打包匹配的顺序
               },
               default:{
                  minChunks:2,
                  priority:-20
               }}}}
   2 分析打包的信息
    2.1.script --profile --json >stats.json 自动生成stats.json文件
    2.2.打开分析工具 http://webpack.github.io/analyse/ 或者 https://github.com/webpack-contrib webpack-bundle-analyzer
   3 import(/* webpackPrefetch:true*/"./a.js") //预存取 当主进程都加载完毕后，网络得到空闲，就去加载异步引入的模块
```

### Loader

#### 就是一个函数 只能是声明式函数，不能是箭头函数

> 该函数接受源代码
> 接受参数 options

```js
    resolveLoader:{
        //查找loader时，先去node_modules下查找，查找不到时，再去loaders目录下
         modules:["node_modules","./loaders"]
    },
    use:[
            {  'replaceLoader',
                   {
                       loader:'replaceLoaderAsync',
                       options:{
                           name:'kkb'
                       }
                   }
            }
      ]
    module.exports =function(source){
    console.log(this.query) //query是一个对象={name:'kkb'}也就是options
    const result source.replace('你好',this.query.name)
    this.callback(err,result)// err是错误信息 Error|null,可以返回多个参数
    //处理异步代码 this.async()返回的而是callback在异步代码中 返回时直接使用cb(null,result)
    const cb = this.async()
}
```

### plugins

> 设计模式 事件驱动 发布订阅
> plugin 是一个类，构造函数接受一个 options 就是 new xxxplugin({})传过来的参数
> 里面包含一个 apply(compiler) compiler 包含很多 hooks

```js
//作用 在dist目录产生之前，先产生一个txt文件
class CopyrightWebpackPlugin {
  constructor(options) {
    console.log(options);
  }
  //compiler是一个webpack实例 包含打包的所有信息
  //compilation是本次打包的信息
  apply(compiler) {
    //emit 是在dist资源目录产生之前触发的钩子
    compiler.hooks.emit.tapAsync(
      "CopyrightWebpackPlugin",
      (compilation, cb) => {
        //compilation.assets包含即将放入dist文件下的资源
        compilation.assets["copyright.txt"] = {
          source: function() {
            return "hello copy";
          }, //.txt文件下的内容
          size: function() {
            return 1024;
          } //.txt文件的体积
        };
        cb();
      }
    );
  }
}
module.exports = CopyrightWebpackPlugin;
```

### webpack 打包原理

> development 打包以后实际就是一个闭包函数----浏览器能运行的代码
> function()(入口文件：function(){源代码})
