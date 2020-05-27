let path = require('path')
class P{
  apply(compiler){
      compiler.hooks.emit.tap('emit',function(){
          console.log('emit')
      })
  }
}
module.exports = {
    mode:'development',
    entry:'./src/index.js',
    output:{
        filename:"bundle.js",
        path:path.resolve(__dirname,'dist')
    },
    // resolveLoader:{
    //   modules:["node_modules",'./loader']
    // },
    module:{
        rules:[
            {
                test:/\.less$/,
                use:[
                   path.join(__dirname,'loader','style-loader'),
                   path.join(__dirname,'loader','less-loader') 
                ]
                
            }
        ]
    },
    plugins:[
        new P()
    ]
}