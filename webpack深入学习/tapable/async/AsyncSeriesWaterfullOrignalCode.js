class AsyncSeriesWaterfallHook{
    constructor(args){
       this.tasks = [];
    }
    tapAsync(name,task){
       this.tasks.push(task);
    }
    callAsync(...args){
     let index = 0;
     let finalCallback = args.pop();
     let next = (err,data)=>{
         if(err === 'error') return finalCallback() 
         let task = this.tasks[index];
         if(!task) return finalCallback()
         if(index === 0){
             task(...args,next)
         }else{
             task(data,next)
         }
         index++
     }
     next()
    }
}
let hook = new AsyncSeriesWaterfallHook(['name'])
hook.tapAsync('react',(name,cb)=>{
    setTimeout(()=>{
        console.log('react',name);
        cb('error','react')//什么时候执行完
    },1000)
})
hook.tapAsync('node',(name,cb)=>{
    setTimeout(()=>{
        console.log('node',name);
        cb(null)//什么时候执行完
    },1000)
   })
hook.callAsync('xlx',function(){
    console.log('end')
});