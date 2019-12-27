const path = require("path");
//使用插件需要引入 插件都基于类 要实例化
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const webpack = require("webpack");

module.exports = {
  mode: "development", //打包后的文件不再是压缩的

  devtool: "cheap-module-eval-source-map", //开发环境下 知道打包以后定位到原代码
  //devtool:'cheap-module-source-map //线上环境

  devServer: {
    contentBase: "./dist", //资源文件目录 在哪一个目录下启动这个服务器
    open: true, //自动打开浏览器
    port: 8081, //端口
    hot: true
  },

  //入口文件配置信息 string | array | object
  entry: {
    index: "./src/index.js", //main是打包后的名称
    list: "./src/list.js",
    detail: "./src/detail.js"
  },
  output: {
    //线上打包后的文件都是以xxx为前缀的
    //publicPath:'xxx',
    //打包后的文件放在的位置  绝对路径
    path: path.resolve(__dirname, "dist"),
    //占位符 上一个文件的名字 从入口过来的文件
    filename: "[name].js"
  },

  module: {
    //遇到以s结尾的都是数组
    rules: [
      {
        //这个e可有可无
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: "url-loader", //遇到jpg会转化为base64
          options: {
            //配置name 以原文件 文件名命名打包后的文件
            // ext 保留旧文件的后缀
            //当前打包的一个版本号 一般用在css,js文件上 增加缓存
            name: "[name]_[hash].[ext]",
            //图片放在imgs文件夹下面
            outputPath: "imgs/",
            //当遇到的图片大小小于2kb时,才会转为base64,大于limit的图片移动到imgs文件夹下
            limit: 2048
          }
        }
      },
      {
        test: /\.scss$/,
        //自后往前，自左向右 默认插入到打包的.js文件
        //style-loader 在hmtl上自动生成style标签，将生成后的css代码放到里面从而生效
        //MiniCssExtractPlugin将css文件抽取出来 形成一个文件
        use: [
          //'style-loader'
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [require("autoprefixer")]
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.css$/,
        //自后往前，自左向右 默认插入到打包的.js文件
        //style-loader 在hmtl上自动生成style标签，将生成后的css代码放到里面从而生效
        //MiniCssExtractPlugin将css文件抽取出来 形成一个文件
        use: [
          //'style-loader'
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [require("autoprefixer")]
            }
          }
        ]
      },
      {
        test: /\.jsx?$/,
        //排除该文件下的.js文件 为了提升性能，使用绝对路径
        exclude: path.resolve(__dirname, "./node_modules"),
        //include:path.resolve(__dirname,'./src) //只对src目录下的.js做处理
        loader: "babel-loader",
        //若后面有options 会走options 若没有 走.babelrc文件
       
      }
    ]
  },
  //在production模式下，是自动配置好的optimization:{}当sideEffexts还是需要配置的
  optimization:{
    usedExports:true//查看哪些被导出的模块被使用，然后在进行打包
    //sideEffects:false对所有模块都进行tree shaking 
    // 但是当我们使用import './css/*.js 或者import @babel/polyfill时 使用Tree Shaking打包时，发现此模块并没有import引入任何的模块
    // 会认为我们并没有使用这个模块 就会不会进行打包 通过设置sideEffects:['@babel/polyfill','./css/*js]将这两个模块排除在外，不使用treeShaking进行打包 
    // 在development模式下，即使配置了，tree Shaking也没有真正的生效，它还是会保留没有引入的代码，方便查看报错代码的位置
    // 在production模式下，tree-shaking才会真正的起作用
  },
  plugins: [
    new htmlWebpackPlugin({
      //以此为dist文件夹下html的生成模板
      //生成的.html文件会自动引入打包生成的.js文件
      title: "hello 我是首页",
      template: "./src/index.html"
      //inject 改变.js文件引入的位置
      //filename:xxx.html 不能使用ext 不能使用[name]占位符 [name]代表chunk的ID
      //chunks:['list','index']可以指定打包后的index.htmL引入哪些.js文件
    }),
    new CleanWebpackPlugin(), //每次打包的时候对dist目录做一次清空
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new webpack.HotModuleReplacementPlugin()
  ]
};
