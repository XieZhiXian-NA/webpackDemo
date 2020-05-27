class AsyncSeriesHook{
    constructor(args){
       this.tasks = [];
    }
    tapAsync(name,task){
       this.tasks.push(task);
    }
    callAsync(...args){
      let finalCallback = args.pop();
      let index = 0
      let next = ()=>{
         if(this.tasks.length === index) return finalCallback()//终止结束条件
         let task = this.tasks[index++]
         task(...args,next)//当执行cb()回调函数时，再去执行下一个函数
      }
      next()
    }
}
let hook = new AsyncSeriesHook(['name'])
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