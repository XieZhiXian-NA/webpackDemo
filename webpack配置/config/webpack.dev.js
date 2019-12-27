const webpack = require("webpack");

const devConfig = {
  mode: "development", //打包后的文件不再是压缩的

  devtool: "cheap-module-eval-source-map", //开发环境下 知道打包以后定位到原代码
  //devtool:'cheap-module-source-map //线上环境

  devServer: {
    contentBase: "./dist", //资源文件目录 在哪一个目录下启动这个服务器
    open: true, //自动打开浏览器
    port: 8081, //端口
    hot: true
  },

  optimization:{
    usedExports:true
   
  },
  plugins: [
   
    new webpack.HotModuleReplacementPlugin()
  ]
};
module.exports = devConfig
