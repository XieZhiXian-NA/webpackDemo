let express = require('express');
let app = express();
let path = require('path');

app.get('/user',(req,res)=>{
    res.json({name:'xlx'})
})

let str = path.relative('D:\\eletron\\webpacks\\webpackByHands','D:\\eletron\\webpacks\\webpackByHands\\src\\index.js');
console.log(str)



app.listen(3000,()=>{
    console.log('服务器启动在3000')
})