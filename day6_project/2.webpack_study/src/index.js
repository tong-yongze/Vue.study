//  导入 jquery
import $ from 'jquery';
import './css/1.css';
import './less/index.less';
$(function () {
    // 实现 奇偶行 颜色渐变
    $('li:odd').css('backgroundColor', 'pink')
    $('li:even').css('backgroundColor', 'orange')

})

class Person {
    static info = 'aaa'
}
console.log(Person.info);

import Vue from 'vue'

import App from './components/App.vue'

const vm = new Vue({
    el: '#app',
    render: h => h(App)
})