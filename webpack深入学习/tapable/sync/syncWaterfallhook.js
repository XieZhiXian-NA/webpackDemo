let {SyncWaterfallHook} = require('tapable');
class Lesson{
    constructor(){
        this.hooks={
            arch:new SyncWaterfallHook(['name'])
            
        }
    }

    tap(){//注册监听函数,tap将事件注册到数组里
        this.hooks.arch.tap('node',function(name){
             console.log('node',name);
             return 'node学得很好'
        }); 
        this.hooks.arch.tap('react',function(data){
            console.log('react',data)
            return 'react is good'
        });
        this.hooks.arch.tap('webpack',function(name){
            console.log('webpack',name);
            //return 'node学得很好'
       }); 
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