const path = require('path')
const CopyrightWebpackPlugin = require('./plugins/copyrightWebpack-plugin')
module.exports={
    mode:'development',
    entry:"./src/index.js",
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:"[name].js"
    },
    resolveLoader:{
        //查找loader时，先去node_modules下查找，查找不到时，再去loaders目录下
         modules:["node_modules","./loaders"]
    },
    
    module:{
        rules:[
            {
                test:/\.js$/,
                use:[
                    'replaceLoader',
                   { 
                       loader:'replaceLoaderAsync',
                       options:{
                           name:'kkb'
                       }
                   }

                ]
            }
        ]
    },
    plugins:[
        new CopyrightWebpackPlugin({
            name:'xzx'
        })
    ]
}