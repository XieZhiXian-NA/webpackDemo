class SyncWaterfallHook{
    constructor(args){
       this.tasks = [];
    }
    tap(name,task){
       this.tasks.push(task);
    }
    call(...args){
       let [first,...others] = this.tasks;
       let ret = first(...args);
       others.reduce((a,b)=>{
           // a 初始值（或者上一次回调函数的返回值）
            return  b(a)
       },ret)

    }
}
let hook = new SyncWaterfallHook(['name'])
hook.tap('react',function(name){
 console.log('react',name)
 return 'react is ok'
})
hook.tap('node',function(data){
    console.log('node',data)
    return 'node is good'
})

   hook.tap('webpack',function(data){
    console.log('webpack',data)
 })
hook.call('xlx');