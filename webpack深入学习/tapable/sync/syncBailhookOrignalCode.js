class SyncBailHook{
    constructor(args){
       this.tasks = [];
    }
    tap(name,task){
       this.tasks.push(task);
    }
    call(...args){
     
       let ret;//当前函数的返回值
       let index=0;  //第一个必须执行
       do{
           ret = this.tasks[index++](...args)
       }while(ret === undefined && (index<this.tasks.length))

    }
}
let hook = new SyncBailHook(['name'])
hook.tap('react',function(name){
 console.log('react',name)
 return '停止向下执行'
})
hook.tap('node',function(name){
    console.log('node',name)
   })
hook.call('xlx');