let {SyncBailHook} = require('tapable');
class Lesson{
    constructor(){
        this.hooks={
            //arch:new SyncHook(['name'])
            arch:new SyncBailHook(['name'])
            //熔断，当钩子函数执行时可以决定是否继续向下执行
            //当返回的值为undefined时，可以继续向下执行
            //当返回值不为undefined时，不可以向下执行
        }
    }

    tap(){//注册监听函数,tap将事件注册到数组里
        this.hooks.arch.tap('node',function(name){
             console.log('node',name);
             return '想停止学习'
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