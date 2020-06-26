# js 为什么是单线程的

## 进程：运行以后的程序叫做进程，一般情况下，一个进程就只能执行一个任务，如果有多个任务需要执行，有以下机制解决方法：

## 排队：等前一个执行完成在执行后面的任务

## 新建进程：为每个任务新建一个进程

## 新建线程：因为进程太消耗资源，所以如今的程序往往允许一个进程包含多个线程，有线程去完成任务

1、由于多线程需要共享资源，且有可能修改彼此的远程结果，导致一些不可预期的错误和问题。假如一个连个线程同时操作一个 dom，一个增加属性，一个删除属性或者移除 dom，name 这个结果以谁为准，这就很难判断。

2、由于很多任务比较耗时，比如 ajax 异步请求，如果多个线程都在进行，那么就会出现占用多倍的系统资源，在闲的时候又出现闲置多倍资源的情况，这明显不合理

## 所以 js 的单线程就是为了解决这些问题的

# EventLoop ：是一个程序结构，用于等待和发送消息和事件。简单说，就是在程序中设置两个线程：一个负责程序本身的运行，称为"主线程"；另一个负责主线程与其他进程（主要是各种 I/O 操作）的通信，被称为"Event Loop 线程"（可以译为"消息线程"）。

<img  src='../img/2013102004.png'/>

### 上图主线程的绿色部分，还是表示运行时间，而橙色部分表示空闲时间。

<strong>每当遇到 I/O 的时候，主线程就让 Event Loop 线程去通知相应的 I/O 程序，然后接着往后运行，所以不存在红色的等待时间。等到 I/O 程序完成操作，Event Loop 线程再把结果返回主线程。主线程就调用事先设定的回调函数，完成整个任务</strong>。

可以看到，由于多出了橙色的空闲时间，所以主线程得以运行更多的任务，这就提高了效率。这种运行方式称为"异步模式"（asynchronous I/O）或"非堵塞模式"（non-blocking mode）。

# TASK（microtask，macrotask）

## 浏览器中：

### macrotask：script，setTimeout，setInterval, I/O

### microtask：Promise.then、MutationObserver, messageChannel 、mutationObersve

### 执行过程：主线程 macrotask -> microtask -> microtask（如果这个过程中出现 microtask 则会把它放入 microtask 队列继续执行） -> macrotask

### 所以在浏览器中微任务有一定的优先执行权，比如 Promise.then , MutationObserver 都会在下一个宏任务之前执行

## 运行机制

### 执行一个宏任务（栈中没有就从事件队列中获取）

### 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中

### 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）

### 当前宏任务执行完毕，开始检查渲染，然后 GUI 线程接管渲染

### 渲染完毕后，JS 线程继续接管，开始下一个宏任务（从事件队列中获取）

## Node 中：

### macrotask：setTimeout，setInterval，setImmediate, I/O

### microtask：Promise.then 、nextTick 、 messageChannel 、mutationObersve

### setTimeout 和 setImmediate 执行顺序不一定，取决于 node 的执行时间

```
setTimeout(function () {
    console.log('setTimeout1');
})
setImmediate(function () {
    console.log('setImmediate2');
});
```

### 如果 i/o 文件操作以后就会先执行 setImmediate,因为 iO 操作属于宏任务，完成后会执行微任务队列, 而 setTimeout 又是下一次循环了

```
let fs = require('fs');
fs.readFile('1.log', function () {
  console.log('fs');
  setTimeout(function () {
    console.log('timeout');
  });
  setImmediate(function () {
    console.log('mmiediate');
  });
});

```

### 微任务中 nextTick 会比 then 先执行

```
Promise.resolve().then(function () {
  console.log('then2')
});
process.nextTick(function () {
  console.log('nextTick1');
});

```
