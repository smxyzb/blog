# Promise

## 简单说就是一个容器，里面保存着某个未来才会结束的时间（通常是一个异步操作）

## 特点：

### Promise 对象的状态不收外部影响，它有 pendding，fullfiled，rejected 三中状态

### 状态一旦改变就不会再变，并且只能由 pendding 变为其他两种状态

## 方法

### resolve()

### reject()

### then()

### catch()：错误捕获

### finally()：不管怎么样都会最终执行

### all(arr)：参数是一个 Promise 数组，只要有一个 rejected 就会中断，全部 resolve 才会 resolve

### race()：参数是一个 Promise 数组，只要有一个 rejected 就会中断，有一个 resolve 就 reeolve

### allSettled()：方法接受一组 Promise 实例作为参数，包装成一个新的 Promise 实例。只有等到所有这些参数实例都返回结果，不管是 fulfilled 还是 rejected，包装实例才会结束。<a href="https://github.com/tc39/proposal-promise-allSettled">ES2020 引入</a>

```
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);

const allSettledPromise = Promise.allSettled([resolved, rejected]);

allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

#### 可用来检测一些操作是否都结束，而 all 则做不到这一点

### any(arr)：只要参数实例有一个变成 fulfilled 状态，包装实例就会变成 fulfilled 状态；如果所有参数实例都变成 rejected 状态

#### 跟 all 和 race 很像，只不过<strong>不会因为某个 Promise 变成 rejected 状态而结束<strong>

### try ：可以不管 f 是否包含异步操作，都用 then 方法指定下一步流程，用 catch 方法处理 f 抛出的错误，就可以使用 try

```
const f = () => console.log('now');
Promise.try(f);
console.log('next');
```
