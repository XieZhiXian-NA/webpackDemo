//webpack是node的写法
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyjsWebpackPlugin= require('uglifyjs-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const Happypack = require('happypack')
module.exports = {
 resolve:{//解析，第三方包common,强制只在该模块下面查找,更改webpack的查找第三方模块的位置
    modules:[path.resolve('node_modules')],
    mainFields:['style','main'],//在import文件时，先从package.json中的哪个选项先入口
    alias:{
        '@':path.resolve('src')
    },
    extensions:['.js','.css','.less','json']//用户在导入时可以不使用后缀.css，.json
 },
  devServer:{
     //开发服务器的配置
     port:4000,
     progress:true,
     contentBase:'./dist', //启动的服务的地址
     compress:true,
     open:true,
     hot:true,
    //有服务后端，不使用代理，在服务端启动webpack端口用服务端端口
    //在服务端启动webpack,前端后端都在一个域一个端口下面

    //  //前端只想单纯模拟数据
    //  before(app){//服务启动之前
    //     app.get('/user',(req,res)=>{
    //         res.json({name:'dsds'})
    //     })
    //  }
    //代理数据
    //  proxy:{
    //      '^/api':{
    //          target:'http://localhost:3000',
    //          pathRewrite:{'^/api':''},
    //          changeOrigin: true
    //      }
    //  }
  },
//mode:"production",//开发和生产模式
mode:"development",

  optimization:{//优化项,可以优化css(压缩)，js
    minimizer:[
        new UglifyjsWebpackPlugin({
            //cache:true,//启动缓存
            parallel:true,//并行打包
            sourceMap:true,//源码映射
        }),
        new OptimizeCssAssetsWebpackPlugin(),
    ],
    // splitChunks:{//分割代码块，抽离公共代码
    //    cacheGroups:{//缓存组
    //      common:{//公共的模块
    //         chunks:'initial',//从入口处
    //         minSize:0,
    //         minChunks:2,
    //      },
    //      vendor:{
    //          test:/node_modules/,
    //          chunks:'initial',
    //          minSize:0,
    //          minChunks:1,
    //          priority:10,//先抽离第三方的模块，再去抽离公共的非第三方模块
    //      }
           
    //    }
    // } 
  },
  
 entry:'./src/index.js',//单入口
//   entry:{//多入口
//     index:'./src/index.js',
//     other:'./src/other.js'
//   },
  output:{
      filename:'[name].[hash:8].js',//hash值只显示8位
      path:path.resolve(__dirname,'dist'),  //路径必须是一个绝对路径
     //publicPath:'http://www.xlxl.com'//引用资源的一个绝对路径开头，
  },
//    watch:true,//监控实时的打包
//    watchOptions:{
//        poll:10000, //每秒问我1000次,要不要更新
//        aggregateTimeout:500,//防抖，过了500ms才打包
//        ignored:/node_modules/  //不需要进行监控的文件 
//    },
  //devtool:"source-map",//增加映射文件,方便调试源码
  //devtool:'eval-source-map',//不会产生单独的文件，但是可以显示行和列((定位到出错的行，并告诉你，出错的是什么)，将.mpa文件打包进bundle中了
  //devtool:'cheap-module-source-map',//不会产生列，但是生成一个单独的映射文件，产生后可以保留
  //devtool:"cheap-module-eval-source-map",//不会产生列(定位到出错的行，但是并没有告诉你，出错的是什么)，集成在打包后的文件中,开发环境
  plugins:[
      new HtmlWebpackPlugin({
          template:'./src/index.html',
          filename:'index.html',
          //chunks:['index'],//生成的html引入各自对应的打包后的文件
          //压缩html文件
          minify:{
              removeAttributeQuotes:true,//删除属性的双引号
              collapseWhitespace:true,//删除空白行，合并为一行
          },
          hash:true,//给引入的文件添加一个hash戳
      }),
    //   new HtmlWebpackPlugin({
    //     template:'./src/index.html',
    //     filename:'other.html',
    //     chunks:['other'],
    //     //压缩html文件
    //     minify:{
    //         removeAttributeQuotes:true,//删除属性的双引号
    //         collapseWhitespace:true,//删除空白行，合并为一行
    //     },
    //     hash:true,//给引入的文件添加一个hash戳
    // }),
      new MiniCssExtractPlugin({
          filename:'css/[name].css'
      }),
    //   new webpack.ProvidePlugin({
    //       $:"jquery"//将jquery注入到每一个模块，而不需要import引入
    //   }) 
    //new CleanWebpackPlugin(),//将dist目录删除
    new CopyWebpackPlugin({
        patterns:[
            {from:'./doc',to:'./'}//to的路径是相对于output的路径
        ]
    }),
    new webpack.BannerPlugin('make 2020 by xlx'),
    new webpack.DefinePlugin({
        //创建可在配置全局常量的编译
        DEV:JSON.stringify('production')//定义DEV的值为production/development
        //'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.IgnorePlugin({//若使用locale,则忽略掉moment中的引入本地的文件，改为手动引入
        resourceRegExp: /^\.\/locale/,
        contextRegExp: /moment/
    }),
    new webpack.DllReferencePlugin({//打包时，先去找动态链接库里有没有，没有再去打包
        manifest:path.resolve(__dirname,'dist','manifest.json')
    }),
    new webpack.NamedModulesPlugin(),//打印更新的模块的路径
    new webpack.HotModuleReplacementPlugin(),//热更新插件，使用其样式也会更改,但这样仍然是强制更新（更新整个页面），
    // new Happypack({
    //     id:"js",
    //     use:[
    //         {
    //             loader:"babel-loader",
    //             options:{
    //                 presets:[
    //                     '@babel/preset-env',
    //                     //   [
    //                     //     '@babel/preset-env',
    //                     //     {
    //                     //         "useBuiltIns":"usage",
    //                     //         "corejs":3
    //                     //     }
    //                     //   ]
    //                     '@babel/preset-react'
    //                 ],
    //                 plugins:[
    //                     ["@babel/plugin-proposal-decorators", { "legacy": true }],
    //                     ["@babel/plugin-proposal-class-properties", { "loose" : true }],
    //                     ["@babel/plugin-transform-runtime",{ corejs: 3 }],
    //                     //"@babel/plugin-transform-runtime"
    //                 ]
    //             }
    //         }
           
    //     ]
    // }),
    // new Happypack({
    //     id:"css",
    //     use:[
    //         MiniCssExtractPlugin.loader, //把css解析完成后，不再放到style标签中，而是放到link标签中,
    //         'css-loader',
    //         'postcss-loader',  
    //     ]
    // })
  ],
  externals:{
      //import $ from 'jquery'将不会被打包进去，全局使用$
    // jquery:"$"
  },
  module:{
    noParse:/jquery | lodash | moment/,//import 时不去解析jquery中依赖图谱
    rules:[
        // {
        //    test:require.resolve('jquery'),//查询某个模块文件的完整绝对路径的文件名,其绝对路径解决模块名称
        //    use:'expose-loader?$' //将jquery暴露为名为$的全局=变量，可以在浏览器直接使用window.$
        // },
        
        {
            test:/\.html$/,
            use:'html-withimg-loader'
        },

        {
           test:/\.(png|jpe?g|gif)$/,
           use:{
            //    // 默认会在打包生成的文件下面，生成一张图片，并将生成的图片名字返回
            //     // 都会发起一次http请求
            //    loader:'file-loader',
            //    options:{
            //        esModule:false,//开启commonjs模块
            //        name:"[name]_[hash:8].[ext]"
            //    }
            loader:'url-loader',
            //做限制，并不是全部都发起网络请求，将小图片转为base64嵌入到html中，
            options:{
                limit:2048,
                esModule:false,
                name:"[name]_[hash:8].[ext]",
                outputPath:'/img/',//output路径是相对于publicPath的
                publicPath:'http://www.xlxl.com'//只有图片通过cdn的方式引入
            }
           } 
        },

        //css-loader,负责解析@import这种语法，
        //style-loader,将css插入到head的style标签中
        //loader的顺序，从右向左
        {
        test:/\.less$/,
        use:[
           MiniCssExtractPlugin.loader,
           'css-loader',
           'postcss-loader',
           'less-loader'//把less转化为css
        ]
        },   
        {
            test:/\.css$/,
            use:[
                MiniCssExtractPlugin.loader, //把css解析完成后，不再放到style标签中，而是放到link标签中,
                'css-loader',
                'postcss-loader',
            ]
            //use:'Happypack/loader?id=css'
        },
    //    {
    //        test:/\.js$/,
    //        use:{
    //           loader:'eslint-loader'
    //        }
    //    },
        {
            test:/\.js$/,
            include:path.resolve(__dirname,'src'),
            exclude:path.resolve(__dirname,'./node_modules'),
            //use:'Happypack/loader?id=js',
            use:
                {
                    loader:"babel-loader",
                    options:{
                        presets:[
                            '@babel/preset-env',
                            //   [
                            //     '@babel/preset-env',
                            //     {
                            //         "useBuiltIns":"usage",
                            //         "corejs":3
                            //     }
                            //   ]
                            '@babel/preset-react'
                        ],
                        plugins:[
                            ["@babel/plugin-proposal-decorators", { "legacy": true }],
                            ["@babel/plugin-proposal-class-properties", { "loose" : true }],
                            ["@babel/plugin-transform-runtime",{ corejs: 3 }],
                            //"@babel/plugin-transform-runtime"
                        ]
                    }
                }
            
                
            
        },
    ]
   }
}