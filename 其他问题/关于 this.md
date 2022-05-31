#### 全局作用域中的 this

指向全局对象，例如：浏览器中为 window

#### 函数作用域中的 this

指向该函数

#### 构造函数中的 this

指向新生成的对象

#### 对象方法的 this

谁调用指向谁

#### 改变 this 指向的集中方法：

### call，apply,bind

使用 bind 绑定 this 后不能再用 call 或者 apply 改变 this 指向

#### 严格模式下

### 全局作用域中 this 指向全局对象

```
"use strict";
console.log(this); //window 对象
```

### 全局作用域中的函数中的 this 指向 undefined

```
"use strict";

function f1(){
  console.log(this);
}
```

### 对象方法中的 this

指向调用函数方法的对象，也就是谁调用就是谁

### 构造函数的 this

指向构造函数创建的新实例对象

```
"use strict";
function f1(){
  this.say = function(){
    console.log('222')
    return this.value
  }
  console.log(this);
}

var b = new f1()
b.value = 2
console.log(v.say()) // 2

```

### 事件处理函数中 this

指向出发事件的目标对象

## 注意内联事件处理函数

```
<button onclick="alert((function(){'use strict'; return this})());">
内联事件处理1
</button>
// this指向undefined
```

```
<button onclick="'use strict'; alert(this.tagName.toLowerCase());">
内联事件处理2
</button>
// this指向button
```
