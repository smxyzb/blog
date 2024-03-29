# let，const

## 为什么不能重复定义（某公司的问题）：因为 es6 标准就是这么规定的

## 定义的变量名称不会挂载到全局对象 window 上

<a href="https://www.ecma-international.org/ecma-262/6.0/#sec-global-environment-records">ECMA sec-global-environment-records 8.1.1 Environment Records</a>

### ECMA 规范中使用两种主要的环境记录值：声明性环境记录和对象环境记录。

#### 对象环境记录用于定义 ECMAScript 元素（例如 WithStatement）的效果，这些元素将标识符绑定与某些对象的属性相关联。<strong>每个对象环境记录都与一个称为其绑定对象的对象相关联。对象环境记录绑定直接与其绑定对象的属性名称相对应的一组字符串标识符名称</strong>

#### 声明性环境记录用于定义 ECMAScript 语言语法元素（例如 FunctionDeclarations，VariableDeclarations 和 Catch 子句）的效果，这些元素直接将标识符绑定与 ECMAScript 语言值相关联。<strong>每个声明性环境记录都与包含变量，常量，let，类，模块，导入和/或函数声明的 ECMAScript 程序范围相关联</strong>

#### let/const 声明会放在 声明性环境记录 里面，而 var 的变量会通过 对象环境记录 来声明, 所以显而易见说明，let,const 声明的变量不在 window 对象

## 不可重复声明

    ```
    var a =10;
    let a =20; //Identifier 'a' has already been declared
    let a =30; //Identifier 'a' has already been declared
    const a =20; //Identifier 'a' has already been declared
    ```

## 无变量提升

## 块级作用域

```
var a = 10;
const a = 10;
{
    //首先,let ,const 无变量提升；其次这里面形成了一个作用域，与外面的相互不影响
    console.log(a); // a is not defined
    let a =20;
}
```

## const 声明的数据不可改变,如果是引用类型的话，其内部的属性值可以更改

```
const a = {}
a = {}; //TypeError: Assignment to constant variable.
a.test = 'test';
console.log(a); //{ test: 'test' }

const a = [];
b[0] = 'test';
console.log(); // ['test']
```

## 实现

```
function constDeclar(e, v, data) {
  if (!data) data = window;
  var val = data[e], c = 1;
  Object.defineProperty(data, e, {
    enumerable: true, // 可枚举
    configurable: false, // 不能再define
    get: function () {
      return val;
    },
    set: function (newVal) {
      if (c > 1)throw new Error(`
      Identifier '${v}' has already been declared`)
      c++
      val = newVal;
    }
  });
  data[e] = v
  return data[e]
}
constDeclar('g',1)
g = 3 // Identifier 'g' has already been declared
```

## 如何定义一个不能修改的对象（const 为啥能修改引用类型的数据，怎么样不能修改）

### Object.freeze() 冻结对象

### Object.seal() 密封对象

### Object.preventExtensions() 阻止对象扩展

# 展开运算符的原理

## 对于 Object ，没有剩余(...key)：直接根据 key 来赋值

```
var P={a:1,b:3,c:4,D:5}
let {z,b} = P
```

转换成

```
let z = P.z ,b = P.b
```

## 对于 Object ，有剩余(...key)：直接根据 key 来赋值

```
var P={a:1,b:3,c:4,d:5}
let {z,b,...c} = P
```

这里的 c 会通过一个函数方法来进行遍历,将未展开的字段都赋给 c 对象

```
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source); // 先获取keys
    var key, i;  // 记录key
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue; // 看当前key是不是已经展开取到值的key，是就跳过，不是就说明是剩余运算符里面的，直接添加到新对象target 里面
      target[key] = source[key];
    }
  return target;
}

c = _objectWithoutProperties(P, ["z", "b"])
```

## 对于数组 Array ，直接根据数组结构的 index 赋值给对应的 key

```
var P=[1,2,3,4]
let [a,b,c,d] = P
```

转换成

```
"use strict";
var P = [1, 2, 3, 4];
var a = P[0],
    b = P[1],
    c = P[2],
    d = P[3];
```

# Set 和 Map 是基于什么来遍历的，iterator 未完成时候 next 是什么

# Set、Map、WeakSet 和 WeakMap

## Set：类似数组，但是成员都是会唯一的，没有重复的值。允许储存任何类型的唯一值，无论是原始值或者是对象引用

### 操作方法:add(), delete(),has(),clear()

### 遍历方法：keys(),values(),entries()

### 使用场景：数组去重，求交集，并集，差集

```
// 数组去重
Array.from(new Set([1,2,3,4,3,2,1]))

// 求交集
let arr = new Set([...arr1]).filter(val=> arr2.has(val))

// 求并集
let arr = new Set([...arr1,arr2])

// 求差集
let arr = new Set([...arr1]).filter(val=> !arr2.has(val))

```
### 如何构造一个指定内容的数组

```
new Array(3).fill(1)

```

## WeakSet：一个弱引用类型的存储集合

### WeakSet 只允许存储弱引用类似数据，不能存储值

### WeakSet 对象存储的对象值都是被弱引用的，因此垃圾回收机制不考虑 WeakSet 对存储对象的引用，如果没有其他东西引用这个存储的对象，那么这个存储对象将被回收掉

### 操作方法:add(), delete(),has(),clear()

### ES6 规定 WeakSet 不可遍历：因为其成员个数取决于垃圾回收机制，遍历前后可能出现部分成员被回收导致错误

## Map (字典)：一个以[key,value]的形式存储的的字典

### 集合与字典的区别：集合是以[value,value]的形式存储，二字典是以[key,value]的形式存储

### 任何具有 Iterator 接口，并且成员都是一个双元素的数组结构的数据都可以作为 Map 的构造函数的参数传入

### 操作方法：set(),get(),has(),delete(),clear()

### 遍历方法：keys(),values(),entries(),forEach()

### 与其他对象的转换

```
// array -> Map
var arr = new Map([arr])

// Map -> Array
var srr = [...new Map([[1,2],[2,3]])]

// Map-> Object

function mapToObj(map) {
    let obj = Object.create(null)
    for (let [key, value] of map) {
        obj[key] = value
    }
    return obj
}
const map = new Map().set('name', 'An').set('des', 'JS')
mapToObj(map)  // {name: "An", des: "JS"}

// Object -> Map
function objToMap(obj) {
    let map = new Map()
    for (let key of Object.keys(obj)) {
        map.set(key, obj[key])
    }
    return map
}
objToMap({'name': 'An', 'des': 'JS'}) // Map {"name" => "An", "des" => "JS"}
```

## WeakMap：一组键值对的集合，其中的键是弱引用对象，值可以是任意类型数据

### WeakMap 弱引用的只是键名，键值依然是正常引用

### 操作方法 has(), get(), set(), delete()

### ES6 规定，WeakMap 不能遍历

# es6 数组新方法有哪些，reduce 的用法

## from，of，copyWithin，fill，entries, keys, values, includes, find ，findIndex，filter，reduce,flat,flatMap

# ES6 Proxy 与 Reflect 的关系

## Reflect对象可以将其变为函数式的行为
```
//旧写法
try{
   Object.defineProperty(target,name,property);

}catch(e){
   console.log("error");
}

//Reflect对象操作
if（Reflect(target,name,property)）{
     console.log("success");
}else{
    console.log("error")
}

```
## Reflect对象的操作和Proxy对象的操作是一一对应的, 在Proxy的拦截操作中，可以直接利用Reflect对象直接获取Proxy的默认值

``` 
let target = {
  name:"小明",
  age:15
}
let handler = {
  get:function(target,name,property){
      return Reflect.get(target,name,property);
  }
}
let pro = new Proxy(target,handler);
console.log(pro.name)
```