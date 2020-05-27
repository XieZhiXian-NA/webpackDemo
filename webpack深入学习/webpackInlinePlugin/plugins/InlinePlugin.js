const HtmlWebpackPlugin = require('html-webpack-plugin');
class InlinePlugin{
    constructor({match}){
        this.reg = match
    }
    processTag(tag,compilation){
        let newTag,url;
        if(tag.tagName === 'link' && tag.attributes.href.match(this.reg)){
           newTag = {
               tagName:'style',
               attributes:{type:'text/css'}
           }
           url = tag.attributes.href;
        }
        if(tag.tagName === 'script' && tag.attributes.src.match(this.reg)){
            newTag = {
                tagName:'script',
                attributes:{type:'application/javascript'}
            }
            url = tag.attributes.src;
        }
        if(url){
            //文件的内容
            newTag.innerHTML = compilation.assets[url].source();
            delete compilation.assets[url]
            return newTag
        }
        return tag

    }
    processTags(data,compilation){
        let headTags = [];
        let bodyTags = [];
        data.headTags.forEach(headTag=>{
            headTags.push(this.processTag(headTag,compilation))
        })
        data.bodyTags.forEach(bodyTag=>{
            bodyTags.push( this.processTag(bodyTag,compilation))
        })
        return {...data,headTags,bodyTags}
    }
    apply(compiler){
        //借助html-webpack-plugin提供帮助
        compiler.hooks.compilation.tap('InlinePlugin',compilation=>{
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTagGroups.tapAsync(
                'alterAssets',(data,cb)=>{//data是插入html中的各类标签集合
                    data =  this.processTags(data,compilation);
                    cb(null,data)
                })
        })
    }
}
module.exports = InlinePlugin