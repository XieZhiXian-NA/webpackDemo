let {AsyncSeriesWaterfallHook} = require('tapable');
//同时发送多个请求
// 异步钩子 串行--- 并行--需要等待所有并发的异步事件执行后再执行回调函数
// 注册方法，tap同步
// tapAsync(name,callback(data,cb))控制cb的个数  
// tapPromise(name,cb) 注册的是promise
class Lesson{
    constructor(){
        this.hooks={
            arch:new AsyncSeriesWaterfallHook(['name'])
            
        }
    }
    tap(){//注册监听函数,tap将事件注册到数组里
        this.hooks.arch.tapAsync('node',function(name,cb){
            setTimeout(()=>{
                console.log('node',name);
                cb('error','result')//第一个参数为null时，将下一个参数传递给后面的钩子
                                    //当参数为'error'时，则会直接跳过后续所有的钩子函数
            },1000)
            
        }); 
        this.hooks.arch.tapAsync('react',function(name,cb){
            setTimeout(()=>{
                console.log('react',name)
                cb()
            },1000)
           
        })
    }
    //启动钩子
    start(){
         this.hooks.arch.callAsync('xzx',function(){
             console.log('end')
         });//执行回调函数
    }
}
let l = new Lesson();
//注册事件
l.tap();
//执行事件
l.start();