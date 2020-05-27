class SyncLoopHook{
    constructor(args){
       this.tasks = [];
    }
    tap(name,task){
       this.tasks.push(task);
    }
    call(...args){
     this.tasks.forEach(fn=>{
         let ret;
         do{
           ret = fn(...args)
         }while(ret!==undefined)
         
     })

    }
}
let hook = new SyncLoopHook(['name']);
let total = 0
hook.tap('react',function(name){
 console.log('react',name)
   return ++total === 3 ?undefined:'react is ok'
})
hook.tap('node',function(name){
    console.log('node',name)
})

   hook.tap('webpack',function(name){
    console.log('webpack',name)
 })
hook.call('xlx');