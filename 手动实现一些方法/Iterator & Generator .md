# Iterator 遍历器

```
function Iterator(params) {
  let index = 0
  return {
    next: function name() {
      return index < params.length ? {
        value: params[index++],
        done: false
      } : {
        value: undefined,
        done: true
      }
    }
  }
}

const it = Iterator([1, 2])
console.log(it.next());
console.log(it.next());
console.log(it.next());

```

# Generator : Generator 函数会返回一个遍历器对象，也就是说，Generator 函数除了状态机，还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。来自：<a href="https://es6.ruanyifeng.com/#docs/generator">阮一峰ES6</a>

##  Generator（即 * 号） 可以看作是一个包装函数，它将一个普通函数自动处理内部的 Iterator 遍历器，直到遍历完成 。
### 在ES6 中我们提出这么写
  
  ```
  var myFn = function* () {}

  ```

### 下面我们通过 ES5 实现一个 generator 函数来包装myFn函数

```
// 先生成一个遍历器对象供使用
const it = Iterator([1, 2])

function generator(genF, resolve, reject) {
  let result = null
  try{
    result = genF()
  }
  catch(error){}
  console.log(result);

  while (!result.done) {
    result = generator(function myFn(params) {
      return it.next(result.value)
    })
  }
  return result
}

// generator(myFn)
generator(function myFn() {
  const next = it.next()
  return next
})

```

# await ：后面的东西必须是一个 Promise 对象，通过Promise 来处理 generator 迭代器 。

## 我们先用已有的 generator 实现一个Await
```
function Await(syncFn) {
  return generator(syncFn)
}

var g = function myFn() {
  const next = it.next()
  return next
}

let res =  Await(g)
console.log('res');
console.log(res); 
```

#### 我们使用ES6 的 generator 也可以遍历出来

```
function* genF() {
  yield 1
  yield 2
  yield 3
  return 4
}

let res = await Await(genF)
console.log(res);

```

## 完整代码
```
function Iterator(params) {
  let index = 0
  return {
    next(){
      return index< params.length?{
        value:params[index++],
        done:false
      }:{
        value:undefined,
        done:true
      }
    }
  }
}

function generator(genF, resolve, reject) {
  let result = null
  try{
    result = genF()
  }
  catch(error){}
  console.log(result);

  while (!result.done) {
    result = generator(function myFn(params) {
      return it.next(result.value)
    })
  }
  return result
}

function Await(syncFn) {
  return generator(syncFn)
}

// ES5
const it = Iterator([1, 2, 3])
var g = function myFn() {
  const next = it.next()
  return next
}
// ES6 
const it = genF()
function* genF() {
  yield 1
  yield 2
  yield 3
  return 4
}

let res1 =  Await(g)
console.log('res1');
console.log(res1);
let res2 = Await(genF)
console.log('res2');
console.log(res2);

```