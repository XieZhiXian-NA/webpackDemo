class AsyncParallelHook{
    constructor(args){
       this.tasks = [];
    }
    tapPromise(name,task){
       this.tasks.push(task);
    }
    promise(...args){
      let promiseTasks =  this.tasks.map(task=> task(...args))
      return Promise.all(promiseTasks) //全部都执行完返回一个promise
    }
}
let hook = new AsyncParallelHook(['name'])
hook.tapPromise('react',(name)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
         console.log('react',name)
         resolve()
         },1000)
    })
})
hook.tapPromise('node',(name)=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
         console.log('node',name)
         resolve()
         },1000)
    })
})
hook.promise('xlx').then(function(){
    console.log('end')
})