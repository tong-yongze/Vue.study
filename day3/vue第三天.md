## 当 props 接受的数据是复杂数据类型，可以改变里面的内容，但是不允许重新赋值

```javascript
// 假如 props 接受是 arr
let arr = ['a', 'b'];
arr.push('c'); // 允许

arr = ['xxx']; // 在子组件里面不允许重新赋值
```

## 当 props 接受的简单数据类型，直接不允许修改

```javascript
// 假如 props 接受是 str
let str = 'hello world';

str = 'xxx'; // 在子组件里面不允许重新赋值
```

## 子组件怎么去修改父组件里面的数据（自定义事件）

子组件通过 $emit 去触发父组件的自定义事件

```html
<button @click='$emit("enlarge-text")'>扩大父组件中字体大小</button>
```

父组件要有这么一个自定义事件

```html
<menu-item :parr='parr' @enlarge-text='handle'></menu-item>
```

1. 判断数据类型

```javascript
console.log(typeof []); // 'object'
console.log(typeof {}); // 'object'
console.log(typeof null); // 'object'
```

```javascript
let temp = [];
// 判断 a 这个实例是否能够通过 __proto__ 找到 b 的 prototype
// a instanceof b
console.log(temp instanceof Array); // true
// temp.__proto__ === Array.prototype
console.log(temp instanceof Object); // true
// temp.__proto__ === Object.prototype
```

```javascript
// 借用 Object.prototype.toString 可以根据输入结果判断类型
let temp = {};
if (Object.prototype.toString.apply(temp) === '[object Object]' ) {
    // {}
} else if (Object.prototype.toString.apply(temp) === '[object Array]' ) {
    // []
}
```

2. 继承

```javascript
class Person {
    say() {
        console.log('hello');
    }
}

class Son extends Person {}

let s1 = new Son();
s1.say();
```

```javascript
组合继承 = Call 式继承（继承的是属性） + 原型继承（继承的方法）
```

3. undefined + null

```javascript
undefined + 5; // NaN
null + 5; // 数字本身
```

## 子组件向父组件传参

1. 第一种情况，父组件直接通过 $event 接受

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <div :style='{fontSize: fontSize + "px"}'>{{pmsg}}</div>
        <menu-item @enlarge-text='handle($event)'></menu-item>
    </div>
    <script src="js/vue.js"></script>
    <script>
        Vue.component('menu-item', {
            props: ['parr'],
            template: `
        <div>
          <button @click='$emit("enlarge-text", 5)'>扩大父组件中字体大小</button>
          <button @click='$emit("enlarge-text", 10)'>扩大父组件中字体大小</button>
        </div>
      `
        });
        var vm = new Vue({
            el: '#app',
            data: {
                fontSize: 10,
                pmsg: "hello world"
            },
            methods: {
                handle: function (val) {
                    // 扩大字体大小
                    this.fontSize += val;
                }
            }
        });
    </script>
</body>

</html>
```

2. 问题，怎么接受儿子传递过来的其他参数，问题如下

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <div :style='{fontSize: fontSize + "px"}'>{{pmsg}}</div>
        <!-- 这个 $event 只是子组件中 $emit 的第二个参数 $emit("enlarge-text", 5, "hello") -->
        <menu-item @enlarge-text='handle($event)'></menu-item>
    </div>
    <script src="js/vue.js"></script>
    <script>
        Vue.component('menu-item', {
            props: ['parr'],
            template: `
        <div>
          <button @click='$emit("enlarge-text", 5, "hello")'>扩大父组件中字体大小</button>
          <button @click='$emit("enlarge-text", 10, "world")'>扩大父组件中字体大小</button>
        </div>
      `
        });
        var vm = new Vue({
            el: '#app',
            data: {
                fontSize: 10,
                pmsg: "hello world"
            },
            methods: {
                handle: function (val, str) {
                    // 扩大字体大小
                    this.fontSize += val;
                }
            }
        });
    </script>
</body>

</html>
```

3. 解决方案1

$emit("enlarge-text", {num: 10,str: "hello"})，第二个参数直接传递的是一个对象

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <div :style='{fontSize: fontSize + "px"}'>{{pmsg}}</div>
        <menu-item @enlarge-text='handle($event)'></menu-item>
    </div>
    <script src="js/vue.js"></script>
    <script>
        Vue.component('menu-item', {
            props: ['parr'],
            template: `
        <div>
          <button @click='$emit("enlarge-text", {num: 10,str: "hello"})'>扩大父组件中字体大小</button>
          <button @click='$emit("enlarge-text", {num: 5,str: "world"})'>扩大父组件中字体大小</button>
        </div>
      `
        });
        var vm = new Vue({
            el: '#app',
            data: {
                fontSize: 10,
                pmsg: "hello world"
            },
            methods: {
                handle: function (val) {
                    console.log(val);
                    // 扩大字体大小
                    this.fontSize += val.num;
                }
            }
        });
    </script>
</body>

</html>
```

4. 解决方案2

父亲，自定义事件所绑定的方法，不要加括号

```html
<menu-item @enlarge-text='handle'></menu-item>
```

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <div :style='{fontSize: fontSize + "px"}'>{{pmsg}}</div>
        <menu-item @enlarge-text='handle'></menu-item>
    </div>
    <script src="js/vue.js"></script>
    <script>
        Vue.component('menu-item', {
            props: ['parr'],
            template: `
        <div>
          <button @click='$emit("enlarge-text", 10, "hello")'>扩大父组件中字体大小</button>
          <button @click='$emit("enlarge-text", 5, "world")'>扩大父组件中字体大小</button>
        </div>
      `
        });
        var vm = new Vue({
            el: '#app',
            data: {
                fontSize: 10,
                pmsg: "hello world"
            },
            methods: {
                handle: function (num, str) {
                    // console.log(num, str);
                    // 扩大字体大小
                    this.fontSize += num;
                }
            }
        });
    </script>
</body>

</html>
```

5. 思考下面代码的输出结果

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <div :style='{fontSize: fontSize + "px"}'>{{pmsg}}</div>
        <menu-item @enlarge-text='handle(5, $event, 7)'></menu-item>
        <menu-item @enlarge-text='handle'></menu-item>
    </div>
    <script src="js/vue.js"></script>
    <script>
        Vue.component('menu-item', {
            props: ['parr'],
            template: `
        <div>
          <button @click='$emit("enlarge-text", $event, 10)'>扩大父组件中字体大小</button>
          <button @click='$emit("enlarge-text", $event, 10)'>扩大父组件中字体大小</button>
        </div>
      `
        });
        var vm = new Vue({
            el: '#app',
            data: {
                fontSize: 10,
                pmsg: "hello world"
            },
            methods: {
                handle: function (a, b, c) {
                    // a => 5
                    // b => 事件对象
                    // c => 7
                    console.log(a, b, c);
                    // 扩大字体大小
                    // this.fontSize += num;
                }
            }
        });
    </script>
</body>

</html>
```

## 关于插槽

- 匿名插槽

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <!-- #2 不填坑，就用默认挖的坑 -->
        <alert-box></alert-box>
        <!-- #2 填坑，填坑就用自己内容去填，说白了就会用自己的内容去替换整个 slot -->
        <alert-box>
            <p>Hello World</p>
        </alert-box>
    </div>
    <script type="text/javascript" src="js/vue.js"></script>
    <script type="text/javascript">
        /*
          组件插槽：父组件向子组件传递内容
        */
        Vue.component('alert-box', {
            // #1 slot 用来挖坑
            template: `
                <div>
                    <strong>ERROR:</strong>
                    <slot>默认内容</slot>
                </div>
            `
        });
        var vm = new Vue({
            el: '#app',
            data: {

            }
        });
    </script>
</body>

</html>
```

- 具名插槽

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <base-layout>
            <!-- #2 填坑，先找到记号（名字），再填坑 -->
            <p slot='header'>标题信息</p>
            <p>主要内容1</p>
            <p>主要内容2</p>
            <p slot='footer'>底部信息</p>
        </base-layout>
    </div>
    <script type="text/javascript" src="js/vue.js"></script>
    <script type="text/javascript">
        /*
          具名插槽
        */
        Vue.component('base-layout', {
            // #1，挖了一个带记号（名字）的坑
            template: `
                <div>
                <header>
                    <slot name='header'></slot>
                </header>
                <main>
                    <slot></slot>
                </main>
                <footer>
                    <slot name='footer'></slot>
                </footer>
                </div>
            `
        });
        var vm = new Vue({
            el: '#app',
            data: {

            }
        });
    </script>
</body>

</html>
```

Vue2.6.0之后，可以用 `v-slot:` 指令取代填坑时候的 slot，其中 `v-slot:` 可以简写成 # 号

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Document</title>
</head>

<body>
    <div id="app">
        <base-layout>
            <!-- #2 填坑，先找到记号（名字），再填坑 -->
            <!-- <p slot='header'>标题信息</p> -->
            <!-- <template v-slot:header>
                <p>标题信息</p>
            </template> -->
            <template #header>
                <p>标题信息</p>
            </template>
            <p>主要内容1</p>
            <p>主要内容2</p>
            <!-- <p slot='footer'>底部信息</p> -->
            <!-- <template v-slot:footer>
                <p>标题信息</p>
            </template> -->
            <template #footer>
                <p>标题信息</p>
            </template>
        </base-layout>
    </div>
    <!-- <script type="text/javascript" src="js/vue.js"></script> -->
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <script type="text/javascript">
        /*
          具名插槽
        */
        Vue.component('base-layout', {
            // #1，挖了一个带记号（名字）的坑
            template: `
                <div>
                <header>
                    <slot name='header'></slot>
                </header>
                <main>
                    <slot></slot>
                </main>
                <footer>
                    <slot name='footer'></slot>
                </footer>
                </div>
            `
        });
        var vm = new Vue({
            el: '#app',
            data: {

            }
        });
    </script>
</body>

</html>
```

- 作用域插槽：在父组件中可以对子组件的数据进行加工处理

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <!-- 作用域插槽：可以在父组件中操作子组件的数据 -->
    <div id="app">
        <father></father>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
    <template id="father">
        <div style="border: 1px solid red;">
            father
            <son>
                <!-- <template slot-scope="xxx">
                    <ul>
                        <li v-for="(item, index) in xxx.names" v-bind:key="index">{{item}}</li>
                    </ul>
                </template> -->
                <!-- v-slot:插槽的名字，如果说是匿名插槽，默认是 default -->
                <!-- <template v-slot:default="xxx">
                    <ul>
                        <li v-for="(item, index) in xxx.names" v-bind:key="index">{{item}}</li>
                    </ul>
                </template> -->
                <!-- v-slot: 可以简写成 # -->
                <template #default="xxx">
                    <ul>
                        <li v-for="(item, index) in xxx.names" v-bind:key="index">{{item}}</li>
                    </ul>
                </template>
            </son>
        </div>
    </template>
    <template id="son">
        <div style="border: 1px solid green;">
            <slot v-bind:names="names">{{names}}</slot>
        </div>
    </template>
    <script>
        // 定义了 father 组件
        Vue.component('father', {
            template: '#father',
            components: {
                // 这个是 father 下子组件
                son: {
                    template: '#son',
                    data() {
                        return {
                            names: ['迪丽热巴', '马保国']
                        };
                    }
                }
            }
        });
        new Vue({
            el: '#app'
        });
    </script>
</body>

</html>
```