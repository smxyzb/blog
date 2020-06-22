## let 、const

### 不可重复声明

    ```
    var a =10;
    let a =20; //Identifier 'a' has already been declared
    let a =30; //Identifier 'a' has already been declared
    const a =20; //Identifier 'a' has already been declared
    ```

### 无变量提升

### 块级作用域

```
var a = 10;
const a = 10;
{
    //首先,let ,const 无变量提升；其次这里面形成了一个作用域，与外面的相互不影响
    console.log(a); // a is not defined
    let a =20;
}
```

### 、const 声明的数据不可改变,如果是引用类型的话，其内部的属性值可以更改

```
const a = {}
a = {}; //TypeError: Assignment to constant variable.
a.test = 'test';
console.log(a); //{ test: 'test' }

const a = [];
b[0] = 'test';
console.log(); // ['test']
```

## 生成器 genarator 和迭代器 iterator

### genarator 生产 iterator

```
function* read(params) {
    for (let i = 0; i < params.length; i++) {
        const element = params[i];
        yield params[i];
    }
}
let it = read(['js', 'node', 'java'])
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
```

## Set、Map、WeakSet 和 WeakMap

### Set：类似数组，但是成员都是会唯一的，没有重复的值。允许储存任何类型的唯一值，无论是原始值或者是对象引用

#### 操作方法:add(), delete(),has(),clear()

#### 遍历方法：keys(),values(),entries()

#### 使用场景：数组去重，求交集，并集，差集

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

### WeakSet：一个弱引用类型的存储集合

#### WeakSet 只允许存储弱引用类似数据，不能存储值

#### WeakSet 对象存储的对象值都是被弱引用的，因此垃圾回收机制不考虑 WeakSet 对存储对象的引用，如果没有其他东西引用这个存储的对象，那么这个存储对象将被回收掉

#### 操作方法:add(), delete(),has(),clear()

#### ES6 规定 WeakSet 不可遍历：因为其成员个数取决于垃圾回收机制，遍历前后可能出现部分成员被回收导致错误

### Map (字典)：一个以[key,value]的形式存储的的字典

#### 集合与字典的区别：集合是以[value,value]的形式存储，二字典是以[key,value]的形式存储

#### 任何具有 Iterator 接口，并且成员都是一个双元素的数组结构的数据都可以作为 Map 的构造函数的参数传入

#### 操作方法：set(),get(),has(),delete(),clear()

#### 遍历方法：keys(),values(),entries(),forEach()

#### 与其他对象的转换

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

### WeakMap：一组键值对的集合，其中的键是弱引用对象，值可以是任意类型数据

#### WeakMap 弱引用的只是键名，键值依然是正常引用

#### 操作方法 has(), get(), set(), delete()

#### ES6 规定，WeakMap 不能遍历
