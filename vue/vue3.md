#### 数据侦测

### Object.defineProperty

```
Object.defineProperty(obj, key, function(){

})
```

## 缺点

1、先有 key 才能监测，无法检测到对象属性的新增或删除 2、需要对对象 key 进行递归遍历，来进行监测 3、不能监听数组的变化

### Proxy

```
let o = {x:{y:100},z:10}
let p = new Proxy(o, {
    get(target, key) {
        console.log('get value', key)
        return target[key]
    },
    set(target, key, value, receiver) {
        console.log('set value', key)
        target[key] = value
        return true
    }
})
```

## 缺点

1、set 方法应该返回一个布尔值，在严格模式下，如果 set 方法返回 falsish(包括 undefined、false 等)，会抛出异常，这些细节比较麻烦，可以通过 Reflect 来处理。

2、如果代理对象是数组，当调用 push、pop 等方法时，不仅会改变数组元素，也会改变 length 等属性，此时如果代理了 set，则会被触发多次，需要实现去重。

3、proxy 只能代理一层，当代理对象是多层嵌套结构时，需要开发者自己实现将嵌套的属性对象转换为 Proxy 对象，可以通过递归实现。
