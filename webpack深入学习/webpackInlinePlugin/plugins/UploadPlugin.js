class UploadPlugins{
    upload(filename){
        return new Promise((resolve,reject)=>{
            
        })
    }
    apply(compiler){
        compiler.hooks.afterEmit.tapPromise('UploadPlugins',compilation=>{
            let assets = compilation.assets;
            let promise = [];
            Object.keys(assets).forEach(filename=>{
                 promises.push(this.upload(filename))
            })
        })
        return Promise.all()
    }
}
module.exports = UploadPlugins