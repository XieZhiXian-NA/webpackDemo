let {SyncLoopHook} = require('tapable');
class Lesson{
    constructor(){
        this.index = 0;
        this.hooks={
            arch:new SyncLoopHook(['name'])
            //遇到某个不返回undefined的监听函数会多次执行
            
        }
    }

    tap(){//注册监听函数,tap将事件注册到数组里
        this.hooks.arch.tap('node',(name)=>{
             console.log('node',name);
             return ++this.index === 3 ? undefined:"继续学"
        }); 
        this.hooks.arch.tap('react',function(name){
            console.log('react',name)
        })
    }
    //启动钩子
    start(){
         this.hooks.arch.call('xzx');//执行回调函数
    }
}
let l = new Lesson();
//注册事件
l.tap();
//执行事件
l.start();