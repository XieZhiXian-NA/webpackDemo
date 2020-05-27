let {AsyncSeriesHook} = require('tapable');
//同时发送多个请求
// 异步钩子 串行--- 并行--需要等待所有并发的异步事件执行后再执行回调函数
// 注册方法，tap同步
// tapAsync(name,ccallback(data,cb))控制cb的个数  
class Lesson{
    constructor(){
        this.hooks={
            arch:new AsyncSeriesHook(['name'])
            
        }
    }
    tap(){//注册监听函数,tap将事件注册到数组里
        this.hooks.arch.tapPromise('node',function(name){
           return new Promise((resolve,reject)=>{
               setTimeout(()=>{
                console.log('node',name)
                resolve()
                },1000)
           })
            
        }); 
        this.hooks.arch.tapPromise('react',function(name){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                 console.log('react',name)
                 resolve()
                 },1000)
            })
           
        })
    }
    //启动钩子
    start(){
         this.hooks.arch.promise('xzx').then(function(){
             console.log('end')
         })
    }
}
let l = new Lesson();
//注册事件
l.tap();
//执行事件
l.start();