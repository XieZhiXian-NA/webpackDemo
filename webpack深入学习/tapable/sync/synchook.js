let {SyncHook} = require('tapable');
class Lesson{
    constructor(){
        this.hooks={
            arch:new SyncHook(['name'])
            
        }
    }

    tap(){//注册监听函数,tap将事件注册到数组里
        this.hooks.arch.tap('node',function(name){
             console.log('node',name);
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