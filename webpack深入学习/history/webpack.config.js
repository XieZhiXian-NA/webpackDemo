//webpack是node的写法
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  mode:"development",//开发和生产模式
  entry:'./src/index.js',
  output:{
      filename:'bundle.[hash:8].js',//hash值只显示8位
      path:path.resolve(__dirname,'dist')  //路径必须是一个绝对路径
  },

  plugins:[
      new HtmlWebpackPlugin({
          template:'./src/index.html',
          filename:'index.html',
          //压缩html文件
          minify:{
              removeAttributeQuotes:true,//删除属性的双引号
              collapseWhitespace:true,//删除空白行，合并为一行
          },
          hash:true,//给引入的文件添加一个hash戳

      })
  ],
  module:{
    rules:[
        //css-loader,负责解析@import这种语法，
        //style-loader,将css插入到head标签中
        //loader的顺序，从右向左
       {
         test:/\.css$/,
         use:[
             'style-loader','css-loader'
         ]}    
    
    ]
  }

}