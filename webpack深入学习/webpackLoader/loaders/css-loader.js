function loader(source){
    let reg = /url\((.+?)\)/g;
    let pos = 0;
    let current;
    let arr = ['let list = []']
    while(current = reg.exec(source)){
        let [matchUrl,g] = current;
        let last = reg.lastIndex - matchUrl.length;
        //innerHTML不支持换行，注意使用JSON.stringfy() 转为字符串，并且为合并为一行，以及换行 使用的是\n
        arr.push(`list.push(${JSON.stringify(source.slice(pos,last))})`)
        //把g替换成require写法
        arr.push(`list.push('url('+require(${g})+')')`);
        pos = reg.lastIndex;
    }
    arr.push(`list.push(${JSON.stringify(source.slice(pos))})`)
    arr.push(`module.exports = list.join('')`)
    return arr.join('\r\n')
}
module.exports = loader