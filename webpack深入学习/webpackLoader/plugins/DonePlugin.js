class DonePlugin{
    apply(compiler){//hooks上面有很多的钩子
        compiler.hooks.done.tap('DonePlugin',(status)=>{
            console.log('编译完成')
        })
    }
}
module.exports = DonePlugin