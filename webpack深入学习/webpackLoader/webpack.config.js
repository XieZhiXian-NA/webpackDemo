const path  = require('path')
const DonePlugin = require('./plugins/DonePlugin');
const AsyncPlugin = require('./plugins/AsyncPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileListPlugin = require('./plugins/FileListPlugin');
const InlinePlugin = require('./plugins/InlinePlugin')
module.exports = {
    mode:'development',
    entry:'./src/index.js',
    output:{
        filename:"build.js",
        path:path.resolve(__dirname,'dist')
    },
    resolveLoader:{//只负责处理loader模块
          modules:['node_modules',path.resolve(__dirname,'loaders')]
    //     alias:{别名
    //        loader1:path.resolve(__dirname,'loaders','loader1')
    //    }
    },
    devtool:'source-map',
    watch:true,
    plugins:[
      new HtmlWebpackPlugin({
          template:"./src/index.html",
          filename:'index.html'
      }),
      new DonePlugin(),
      new AsyncPlugin(),
      new FileListPlugin({
          filename:'list.md',
      }),
      new InlinePlugin({
          match:/\.(js|css)/
      })
    ],
    module:{
        rules:[
            {
                  test:/\.js$/,
                  //use:path.resolve(__dirname,'loaders','loader1'),
                  //loader分类 pre前面--normal--行内---post后面 执行顺序
                  // require('inline-loader!./a.js') !将后面的文件导入到行内loader内解析
                  // require('-!inline-loader!./a.js') -!不会让文件再去通过pre + normal loader来处理
                  // !没有normal !!什么都不要，只需要inline-loader来解析给该文件
                
                //   use:{
                //       loader:path.resolve(__dirname,'loaders','babel-loader'),
                //       options:{
                //           presets:[
                //           '@babel/preset-env'
                //          ]
                //       }
                //   }
 
                    use:{
                        loader:'banner-loader',//注释
                        options:{
                            text:'lai',
                            filename:path.resolve(__dirname,'banner.js')
                        }
                    }

            },
            // {
            //     test:/\.jpg$/,
            //     use:'file-loader' //根据图片生成一个md5,发射到dist目录下，并返回图片的md5
            // }
            {
                test:/\.jpg$/,
                use:{
                    loader:'url-loader', 
                    options:{
                      limit:2048
                   }
                },
                
            },
            {
                test:/\.less$/,
                use:['style-loader','css-loader','less-loader']
            }

        ]
    }
}