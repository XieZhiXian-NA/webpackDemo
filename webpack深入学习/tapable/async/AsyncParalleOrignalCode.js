class AsyncParallelHook{
    constructor(args){
       this.tasks = [];
    }
    tapAsync(name,task){
       this.tasks.push(task);
    }
    callAsync(...args){
       let finalCallback = args.pop();
       let index = 0
       //并发执行
        let done = ()=>{
            index ++ 
            if(index === this.tasks.length)
            finalCallback()
       }
       this.tasks.forEach(task => {
           task(...args,done)
       });
    }
}
let hook = new AsyncParallelHook(['name'])
hook.tapAsync('react',(name,cb)=>{
    setTimeout(()=>{
        console.log('react',name);
        cb()//什么时候执行完
    },1000)
})
hook.tapAsync('node',(name,cb)=>{
    setTimeout(()=>{
        console.log('node',name);
        cb()//什么时候执行完
    },1000)
   })
hook.callAsync('xlx',function(){
    console.log('end')
});