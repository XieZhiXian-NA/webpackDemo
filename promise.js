class promise{

    constructor(executor){
     
      this.value = undefined
      this.reason = undefined

      this.state = 'pending'

      this.onResolvedCallbacks = []
      this.onRejectCallbacks = []
      
      let resolve = (value)=>{
          if(this.state === 'pending'){
              this.state = 'fulfilled'
              this.value = value
              this.onResolvedCallbacks.forEach(item=>item())
          }
      }

      let reject = (error)=>{
          if(this.state === 'pending'){
              this.state  = 'rejected'
              this.reason = error
              this.onRejectCallbacks.forEach(item=>item())
          }

      }
      try {
          executor(resolve,reject)
      } catch (error) {
          reject(error)
      }


    }
    then(onFulfilled,onRejected){
        //自己构造一个函数 value值就是待运行时的传入的value值
       onFulfilled = typeof onFulfilled==='function'?onFulfilled:value=>value
       onRejected = typeof onRejected==='function'?onRejected:err=>{throw err}
       var promise2 = new Promise((resolve,reject)=>{
               if(this.state === 'pending'){
                   setTimeout(()=>{
                       try {
                         this.onResolvedCallbacks.push(()=>{
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2,x,resolve,reject)
                        })   
                       } catch (error) {
                           reject(error)
                       }
                   },0)
                   setTimeout(()=>{
                       try {
                         this.onRejectCallbacks.push(()=>{
                        let x = onRejected(this.reason)
                        resolvePromise(promise2,x,resolve,reject)
                     })  
                       } catch (error) {
                           reject(error)
                       }
                   },0)
                    
                        
                }
                if(this.state === 'fulfilled'){
                    setTimeout(()=>{
                       try {
                         let x = onFulfilled(this.value)
                         resolvePromise(promise2, x, resolve, reject);  
                       } catch (error) {
                           reject(error)
                       }
                    },0)
                    
                }
                if(this.state === 'rejected'){
                   setTimeout(()=>{
                       try {
                         let x= onRejected(this.reason)
                         resolvePromise(promise2, x, resolve, reject);   
                       } catch (error) {
                        reject(error)
                       }
                      
                   },0)
                   
                }
       })
       return promise2
       
    }
    resolvePromise(promise2,x,resolve,reject){
        if(x===promise2) return reject(new TypeError('Chaing cycle detected for promise'))

        let called //防止多次调用
        if(x!=null && (typeof x === 'object' || typeof x==='function')){
            try {
                let then = x.then
                if(typeof then==='function'){
                    then.call(x,res=>{
                        if(called) return
                        called = true
                        resolvePromise(promise2,res,resolve,reject)
                        
                    },error=>{
                    if(called) return
                    called = true
                    reject(error)

                    })
                }else{
                    //没有then方法 不是primise对象
                    resolve(x)
                } 
            } catch (error) {
                if(called) return
                called = true
                reject(error)
            }
            
        }else{
            resolve(x)
        }
    }
    resolve(value){
        if(value instanceof Promise){
            return value
        }
        return new Promise((resolve,reject)=>{
            if(value && value.then && typeof value.then==='function'){
                setTimeout(()=>{
                    value.then(resolve,reject)
                },0)
            }else{
                resolve(value)
            }
        })
    }
    //传入的是一个promise数组,等待传入的所有promsie对象执行完成后，才返回一个总的promise对象
    all(promises){
     return new Promise((resolve,reject)=>{
         let index = 0
         let result = []
         if(promises.length === 0){
             resolve(result)
         }else{
             function processValue(i,data){
                 result[i] =data
                 if(++index === promises.length)
                   resolve(result)
             }
             for(let i =0;i<promises.length;i++){
                 Promise.resolve(promises[i]).then((data)=>{
                     processValue(i,data)
                 },err=>{
                     reject(err)
                     return 
                 })
             }
         }
     })
    }
}
//catch之后还可以then
Promise.prototype.catch = function(onRejected){
    return this.then(null,onRejected)
}