# 深入学习webpack

## 根目录

webpack的一些基本配置的详细用法及性能优化

## tapable

事件流的一些钩子的源码
通过tapxxx注册钩子方法
通过callxxx调用钩子的方法
串行，并行，都是call方法调用钩子的实现方式的不同

## webpackByHands

通过npm link 链接到全局的npm包中
webpack打包原理

- 初始化plugins，调用plugin.apply()方法，将compiler对象传递给该plugin,在webpack各个阶段执行一些列钩子的call方法，调用各个plugin注册的函数。
- 在获取源码文件时，使用loader解析文件，返回解析后的源码。
- AST解析语法树，重写require名字，重写Ast节点，将引入模块的路径重写为当前模块的绝对路径，根据重写后的AST语法树生成code
- 发射文件到dist目录下
  
## webpackByHand

  npm link webpackByHands将全局链接到本地
  可以在当前目录下使用npx xlx-pack（自己手写的webpack打包工具）打包

## webpackLoader

loader
对源码做一定规则的解析，再返回修改后的源码,使用loader-utils强大插件

- babel-loader 使用babel-core的transform方法根据传进来的options中的preset对.js代码做转换
- banner-loader 在源码之前加入一些注解，并将读取的本地文件也添加到webpack可以检测的文件中
- url-loader 将字符串源码转为二进制，根据options中limit，将其转为base64,还是调用url-loader生成md5戳
- file-loader 根据内容生成一个md5戳并在dist文件下拷贝一份文件名为md5戳的图片，再返回md戳-更改引入的路径
- style-loader使用pitch方法，在其中再使用内联的!!css-loader!less-lader!index.less
  
plugins 
使用compiler的一系列钩子注册方法
compilation拿到本次打包的所有资源（文件源码，大小等）