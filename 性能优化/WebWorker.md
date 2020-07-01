# WebWorker

## 就是为 JavaScript 创造多线程环境，允许主线程创建 Worker 线程，将一些任务分配给后者运行。在主线程运行的同时，Worker 线程在后台运行，两者互不干扰。等到 Worker 线程完成计算任务，再把结果返回给主线程。这样的好处是，一些计算密集型或高延迟的任务，被 Worker 线程负担了，主线程（通常负责 UI 交互）就会很流畅，不会被阻塞或拖慢

### Worker 线程一旦新建成功，就会始终运行，不会被主线程上的活动（比如用户点击按钮、提交表单）打断

### Worker 比较耗费资源，不应该过度使用，而且一旦使用完毕，就应该关闭

## 注意点

### 同源限制分配给 Worker 运行的小本，必须与主线程脚本文件同源

### DOM 限制：Worker 线程所在对的全局对象，与主线程不一样，无法读取主线程所在页面 DOM，也无法使用 Document，window，parent 对象。但是可以使用 navigator,location 对象

### 通讯联系：Worker 和主线程不在同一个上下文环境，不能直接通讯，必须通过消息完成通讯

### 脚本限制：不能使用 alert，confirm 等，可以使用 XMLHttppRequest 发生请求

### 文件限制：无法读取本地文件，脚本必须来自于网络

## 基本使用

### 使用 new 创建 Worker

```
var worker = new Worker('work.js')
worker.onmessage = function (event) {
  console.log('Received message ' + event.data);
  // doSomething();
}
// 关闭worker
worker.terminate();
```

### Worker 线程

#### worker 内部有一个今天函数，监听 message 事件

```
self.addEventListener('message', function (e) {
  self.postMessage('You said: ' + e.data);
}, false);
```

-   self 代表子线程自身，即子线程的全局对象，也可以写成以下方式

```
// 写法一
this.addEventListener('message', function (e) {
  this.postMessage('You said: ' + e.data);
}, false);

// 写法二
addEventListener('message', function (e) {
  postMessage('You said: ' + e.data);
}, false);
```

-   self.addEventListener()指定监听函数，也可以使用 self.onmessage 指定。监听函数的参数是一个事件对象，它的 data 属性包含主线程发来的数据。self.postMessage()方法用来向主线程发送消息

```
self.addEventListener('message', function (e) {
  var data = e.data;
  switch (data.cmd) {
    case 'start':
      self.postMessage('WORKER STARTED: ' + data.msg);
      break;
    case 'stop':
      self.postMessage('WORKER STOPPED: ' + data.msg);
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);
```

### Worker 加载脚本

-   Worker 内部如果需要加载其他脚本，使用 importScripts 方法，可同时加载多个脚本

```
importScripts('script1.js', 'script2.js');
```

### 关闭 Worker

```
// 主线程
worker.terminate();

// Worker 线程
self.close();
```

## 通讯

### Worker 与主线程的通讯传值，是一种拷贝关系，不会相互影响。运行机制是，先将通信内容串行化，然后把串行化后的字符串发给 Worker，后者再将它还原

## 同页面 Web Worker

### 使用页面里面的代码：必须指定<script>标签的 type 属性是一个浏览器不认识的值

```
<script id="worker" type="app/worker">
  addEventListener('message', function () {
    postMessage('some message');
  }, false);
</script>
```

### 读取

```
var blob = new Blob([document.querySelector('#worker').textContent]);
var url = window.URL.createObjectURL(blob);
var worker = new Worker(url);

worker.onmessage = function (e) {
  // e.data === 'some message'
};
```

### 应用场景：轮询

```
function createWorker(f) {
  var blob = new Blob(['(' + f.toString() +')()']);
  var url = window.URL.createObjectURL(blob);
  var worker = new Worker(url);
  return worker;
}

var pollingWorker = createWorker(function (e) {
  var cache;

  function compare(new, old) { ... };

  setInterval(function () {
    fetch('/my-api-endpoint').then(function (res) {
      var data = res.json();

      if (!compare(data, cache)) {
        cache = data;
        self.postMessage(data);
      }
    })
  }, 1000)
});

pollingWorker.onmessage = function () {
  // render data
}

pollingWorker.postMessage('init');
```

## API 接口

### 主线程：

-   Worker.onmessage：指定 message 事件的监听函数，发送过来的数据在 Event.data 属性中。
-   Worker.onerror：指定 error 事件的监听函数。
-   Worker.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
-   Worker.postMessage()：向 Worker 线程发送消息。
-   Worker.terminate()：立即终止 Worker 线程。

### Worker 线程

-   self.name： Worker 的名字。该属性只读，由构造函数指定。
-   self.onmessage：指定 message 事件的监听函数。
-   self.onmessageerror：指定 messageerror 事件的监听函数。发送的数据无法序列化成字符串时，会触发这个事件。
-   self.close()：关闭 Worker 线程。
-   self.postMessage()：向产生这个 Worker 线程发送消息。
-   self.importScripts()：加载 JS 脚本。
