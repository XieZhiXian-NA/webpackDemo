let path = require('path');
let webpack = require('webpack')
module.exports = {
    mode:'development',
    entry:{
        react:['react','react-dom'],
    },
    output:{
        filename:'_dll_[name].js',
        path:path.resolve(__dirname,'dist'),
        library:'_dll_[name]',//把默认导出的东西赋值给变量ab
        //libraryTarget:'commonjs'
    },
    plugins:[
        new webpack.DllPlugin({//要能找到_dll_react中的所有模块的一个清单列表
            name:'_dll_[name]', //name等于library
            path:path.resolve(__dirname,'dist','manifest.json')
        })
    ]
}