class AsyncSeriesHook{
    constructor(args){
       this.tasks = [];
    }
    tapPromise(name,task){
       this.tasks.push(task);
    }
    promise(...args){
      let [first,...others] = this.tasks;
      return others.reduce((p,next)=>{
           return  p.then(()=>next(...args))
      },first(...args))
      
    }
}
let hook = new AsyncSeriesHook(['name'])
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