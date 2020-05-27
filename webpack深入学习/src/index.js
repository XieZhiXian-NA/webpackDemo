
// require('./b.less');
// require ('./index.css');
// let str = require('./a');
// console.log(str);

// let fn = ()=>{
//    console.log('lplpl')
// }

// fn()

// @log
// class A{
//     p = 1;
// }
// function log(target){
//   console.log(target)
// }
// let c = new A();
// import $ from 'jquery' //不会被打包
// console.log($)

import jquery from  'jquery';
import _ from 'lodash';
import moment from 'moment';
import 'moment/locale/zh-cn';
import './d'
import './c'
import './source'
import React from 'react';
import {render} from 'react-dom';

import calc from './test'
console.log(calc.sum(1,2))

render(<h3>jsx</h3>,window.root)

require('./index.css')
import logo from './logo.jpg'
console.log(logo)
let image = new Image();
image.src = logo //就是一个普通的字符串
document.body.appendChild(image);
console.log('sdd');
console.log('666');

let xhr = new XMLHttpRequest();
xhr.open('GET','/user',true);
xhr.onload = function(){
  console.log(xhr.response);
}
xhr.send();

//打包时，忽略引入的语言包

moment.locale('zh-cn')
let r = moment().endOf('day').fromNow();
console.log(r)
console.log('index.js')


let button = document.createElement('button');
button.innerHTML = 'hello'
button.addEventListener('click',function(){
  //import返回的是一个promise对象
    import (/*webpackChunkName:"source"*/'./source.js').then(data=>{
        console.log(data.default)
    })
})
document.body.appendChild(button);
console.log('HRM')
if(module.hot){
  module.hot.accept('./source',()=>{
    //require()
    console.log('文件source发生了更新')
  })
}