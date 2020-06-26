# 如何让 for of 能遍历对象

## 给对象部署[Symbol.iterator]方法

```
let obj = {
  data: {

  },
  a: 1, b: 3, c: function name(params) {

  },
  [Symbol.iterator]() {
    let keyArr = Object.keys(obj)
    let index = 0
    return {
      next() {
        return index < keyArr.length ? {
          value: {
            key: keyArr[index],
            val: obj[keyArr[index++]]
          }
        } : {
            done: true
          }
      }
    }
  }
}

```

# 迭代器 Iterator

## Iterator 迭代器的特点：

### 迭代器协议：产生一个有限或无限序列的值，并且当所有的值都已经被迭代后，就会有一个默认的返回值

### 它实现了一个 next 方法，next 方法必须返回一个对象，并且包含 done 和 value 两个属性

### 迭代未完成时 done 是 false ，完成后是 true,迭代完成后会返回具体的值

## 实现 ：

```
function Iter(arr) {
  let index = 0
  return {
    next(val) {
      return index < arr.length ? { done: false, value: arr[index++] } : {
        done: true, value: undefined
      }
    }
  }
}

const it = Iter([1, 2])
console.log(it.next());
console.log(it.next());
console.log(it.next());
```

# 生成器 Genarator

## Genarator: 调用一个生成器函数并不会马上执行它里面的语句，而是返回一个这个生成器的迭代器对象，当这个迭代器的 next() 方法被首次（后续）调用时，其内的语句会执行到第一个（后续）出现 yield 的位置为止（让执行处于暂停状），yield 后紧跟迭代器要返回的值

```
function* gen(){
  yield 'hello'
  yield 'world'
  return 'end'
}

var IteratorObj = gen()
var res = IteratorObj.next()
```

### IteratorObj 就是生成的迭代器对象，每次 yield 就是对其 next 的调用

### Genarator 生产 Iterator

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

# async/await 实现原理

## async 是 generator 的语法糖，可实现对 generator 的自动迭代

```
function Async(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF()
    function step(nextF) {
      let next
      try {
        next = nextF()
      } catch (error) {
        reject(error)
      }
      if (next.done) {
       return resolve(next.value)
      }
      Promise.resolve(next.value).then((v) => {
        step(function name() {
          return gen.next(v)
        })
      })
    }

    step(function () {
      return gen.next()
    })
  })
}

function* genF() {
  yield 1
  yield 2
  yield 3
  return 4
}

var a = async function name() {
  let res = await Async(genF)
  console.log(res);
}
a()
```

### 可以看出 : 在 Async 方法里面，我们通过 step 方法实现了对迭代器对象 gen 的自动迭代。通过 Promise 处理未迭代完成的逻辑，自调用 step 方法，不仅实现了自动迭代，同时保证了这个过程中返回的始终是一个 Promise，当完成的时候直接返回一个 value 值。 其实 async/await 是 async function 替代了 function \*, await 替代了 yield 并实现了自动迭代

### await 只能在 async 里面使用

## await 机制

### await 后面可以返回一个值或者 Promise 对象

### async 函数中，await 后面的表达式会先执行，并且将下面的代码任务加入到 microtask 中，然后会跳出深耕 async 函数来执行后面的代码。实际上 await 是一个让出执行线程的标志

```
async function async1() {
    console.log('async1 start');
    await async2();
    // 这里将后面的代码都放入microtask，跳出async函数，继续执行后面的Promise任务
    console.log('async1 end');
}
async function async2() {
    console.log('async2');
}
console.log('script start');
setTimeout(function() {
    console.log('setTimeout');
}, 0)
async1();
new Promise(function(resolve) {
    console.log('promise1');
    resolve();
}).then(function() {
    // 放入microtask
    console.log('promise2');
});
console.log('script end');
//输出 script start -> async1 start -> async2 -> promise1 -> script end -> async1 end ->  promise2 -> setTimeout
```

### 上面的 async 等价于

```
async function async1() {
	console.log('async1 start');
	Promise.resolve(async2()).then(() => {
    console.log('async1 end');
  })
}
```

## async/await 的错误处理

### 使用 try catch

```
async function a() {
  try {
    let res = await fetch('www.baidu.com')
  } catch (error) {
    console.log(error);
  }
}
```

### 使用 Promise.catch 捕获错误

```
Promise.resolve().then().catch(e){
  console.log(e)

}
```

# Promise 实现，手写 Promise

# Promise all trace 在其中有个 resolve 或者 reject 的情况
