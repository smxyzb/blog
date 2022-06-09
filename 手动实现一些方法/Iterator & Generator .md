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

function generator(fn) {
  let result
  try {
    result = fn()
  } catch (error) {
  }
  if (result.done) {
    return result
  }
  // 未完成则进入下一轮迭代
  Promise.resolve(result.value).then((v) => {
    generator(function myFn(params) {
      return it.next(v)
    })
  })
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
function Await(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF()
    generator(function () {
      return gen.next()
    })
  })
}

// 使用Await
var a = async function name(params) {
  let res = await Await(function myFn() {
    const next = it.next()
    return next
  })
  console.log(res)
}
a()
```
## 可以看到上面的代码已经能把 遍历器对象遍历出来了，但是我的 Await 内部 输出 res 是 undefined ，这是因为我们的 Await 函数内部的 Promise 没有 resolve generator 的返回值，所以我们需要在 Await 函数内部自己处理这个返回值。

### 这里只需要在 Await 函数内部 让 generator 能够使用 Promise 的方法就可以了。

```
// 给 generator 函数添加一个 resolve ,reject 参数
function generator(fn, resolve, reject) {
  let result
  try {
    console.log('try', fn);
    result = fn()
  } catch (error) {
    reject(error)
  }
  console.log('result', result);
  if (result.done) {
    console.log('done');
    return resolve(result)
  }
  Promise.resolve(result.value).then((v) => {
    // console.log('next generator',v);
    generator(function myFn(params) {
      return it.next(v)
    }, resolve, reject) // 通过参数的形式传入
  })
}

function Await(genF) {
  console.log(genF);
  return new Promise((resolve, reject) => {
    generator(genF, resolve, reject) // 通过参数的形式传入
  })
}

var a = async function name(params) {
  var g = function myFn() {
    const next = it.next()
    return next
  }
  let res = await Await(g)
  console.log(res);
}
a()

```
#### 我们使用ES6 的 generator 也可以遍历出来

```
function* genF() {
  yield 1
  yield 2
  yield 3
  return 4
}

var b = async function name(params) {
  let res = await Await(genF)
  console.log(res);
}

b()
```
