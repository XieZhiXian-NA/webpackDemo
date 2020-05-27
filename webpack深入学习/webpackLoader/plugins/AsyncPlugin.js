class AsyncPlugin{
    apply(compiler){//hooks上面有很多的钩子
        compiler.hooks.emit.tapAsync('AsyncPlugin',(compliation,cb)=>{
            setTimeout(()=>{
                console.log('发射文件等1秒')
                cb()
            },1000)
        })
    }
}
module.exports = AsyncPlugin