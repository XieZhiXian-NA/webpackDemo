const path = require('path');
const MiniCssPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlinePlugin = require('./plugins/InlinePlugin');
const UploadPlugin = require('./plugins/UploadPlugin')
module.exports = {
    mode:'development',
    entry:'./src/index.js',
    output:{
        filename:"build.js",
        path:path.resolve(__dirname,'dist')
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:[MiniCssPlugin.loader,'css-loader']
            },
        ]
    },
    plugins:[
       new MiniCssPlugin({
           filename:'main.css'
       }),
       new HtmlWebpackPlugin({
           filename:'index.html',
           template:"./src/index.html"
       }),
    //    new InlinePlugin({
    //     match:/\.(js|css)/
    //    })
    new UploadPlugin({
        bucket:'',
        domain:'',
        accessKey:'',
        secretKey:''


    })
    ]
}