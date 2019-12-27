const path = require("path");
//使用插件需要引入 插件都基于类 要实例化
const htmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const merge = require('webpack-merge')
const proConfig = require('./webpack.pro')
const devConfig = require('./webpack.dev')

const baseConfig={
    entry: {
        main: path.resolve(__dirname,'../src/index.js'), 
        
        // list: "./src/list.js",
        // detail: "./src/detail.js"
      },
      output: {
        
        path: path.resolve(__dirname, "../dist"),
      
        filename: "[name].js"
      },
      module: {
    
        rules: [
          {
            
            test: /\.(png|jpe?g|gif)$/,
            use: {
              loader: "url-loader", 
              options: {
           
                name: "[name]_[hash].[ext]",
             
                outputPath: "imgs/",
               
                limit: 2048
              }
            }
          },
          {
            test: /\.scss$/,
          
            use: [
             
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
            
            use: [
              
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
            
            exclude: path.resolve(__dirname, "./node_modules"),
         
            loader: "babel-loader",
       
           
          }
        ]
      },
      optimization:{
          //做代码分割
        splitChunks:{
            chunks:'async' 
        }
      },
      plugins:[
        new htmlWebpackPlugin({
            title: "hello 我是首页",
            template: path.resolve(__dirname,'../index.html')
          }),
          new CleanWebpackPlugin(), 
          new MiniCssExtractPlugin({
            filename: "[name].css"
          }),
      ]
}
module.exports = (env)=>{
     if(env && env.production){
         return merge(baseConfig,proConfig)
     }else{
         return merge(baseConfig,devConfig)
     }
}