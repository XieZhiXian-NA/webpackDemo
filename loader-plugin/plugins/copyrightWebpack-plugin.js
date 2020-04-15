//作用 在dist目录产生之前，先产生一个txt文件
class CopyrightWebpackPlugin{
    constructor(options){
        console.log(options)
    }
    //compiler是一个webpack实例 包含打包的所有信息
    //compilation是本次打包的信息
    apply(compiler){
        //同步没有cb回调
        compiler.hooks.compilation.tap(
            "CopyrightWebpackPlugin",
            (compilation)=>{
                console.log('hello webpack')
            } )

        //emit 是在dist资源目录产生之前触发的钩子
        compiler.hooks.emit.tapAsync(
            "CopyrightWebpackPlugin",
            (compilation,cb)=>{
            //compilation.assets包含即将放入dist文件下的资源
            compilation.assets['copyright.txt']={
                source:function(){return 'hello copy'}, //.txt文件下的内容
                size:function(){return 1024}//.txt文件的体积
            } 
            cb()
          }
            
        )
    }
}
module.exports = CopyrightWebpackPlugin;