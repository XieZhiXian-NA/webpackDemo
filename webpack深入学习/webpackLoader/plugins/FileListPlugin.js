class FileListPlugin{
    constructor({filename}){
        this.filename = filename
    }
   apply(compiler){
       compiler.hooks.emit.tap('FileListPlugin',(compilation)=>{
          let assets = compilation.assets 
          let content = `# 文件名 资源大小\r\n`
          content+='\r\n'
          Object.entries(assets).forEach(([filename,stateObj])=>{
                content += `- ${filename}    ${stateObj.size()}\r\n`
          })
          assets[this.filename] = {
              source(){
                    return content;
              },
              size(){
                  return content.length;
              } 
          }
       })
   }
}
module.exports = FileListPlugin