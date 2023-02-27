# commonjs 规范：一个文件就是一个模块，模块内部module代表当前模块变量，module 是一个对象
## 每个模块通过exports 或者 module.exports 导出对外（的对象）接口和方法
## 模块内部this指向exports 或者 module.exports ，即this === exports 
## module对象的一些属性
### id：模块id，唯一标识符
### exports：导出的对象，方法
### parant：模块的父模块，表示模块是由谁加载的
### filename：模块的绝对路径
### loaded：加在状态标识，是否已加载
### children：子模块
### path：表示模块的搜索路径

# require：加在模块的exports 属性
## 加载机制
### require 传入 path 参数 -> 处理 path 生成绝对路径 -> 根据path判断模块是否有缓存 -> 有则返回缓存的exports属性，无则创建一个模块实例 module -> 先将module对象加入缓存 -> 然后再去加载模块 -> return module.exports 返回模块
### 加载的时候先放入缓存，再加载模块，解决了循环引用的问题，因为先在缓存中占位后，如果加载过程中，其他模块又加载了这个模块，那么第二步就会检测到缓存，直接就返回了，有效避免重复加载。
### 存在的问题：多个模块引用同一个模块的情况下，该模块引用可能未加载完成，常出现在循环引用的模块中某个模块为 undefined。

## require 与 import
### require 是commonjs 模块。import 是ES6模块一种静态定义，在编译的时候就生成。
#### exports 导出的是一个模块的拷贝，修改导出的值不会对内部造程影响。import 导出的是对值得引用，修改会对所有引用造成影响。
#### require 是同步的，commonjs规范允许运行时加载，所以它可以存咋代码块的任何位置进行require ，导出对象需要在脚本运行完成后才会生成。import 是异步的，编译的时候会生成一个只读引用，等到使用的时候才会根据这个引用到具体的模块去取值。

## import 的处理
### 在项目里面使用的import 经过webpack 等工具编译后最终会形成类似 require 的形式
```
(function(module, exports, __webpack_require__) {

  __webpack_require__.e/* import() */(0/*! a-async */).then(__webpack_require__.bind(null, /*! ./a */ 82)).then(function (_ref) {
    var a = _ref.default;
    console.log(a);
  });
  
  /***/ })()
  ```

  ### import 处理异步加载原理：
  #### 打包生成chunk.js 文件，以及对应依赖关系，首次加载会加载依赖关系映射
  #### 当需要某个模块的时候，根据依赖关系，利用jsonp 原理，进行远程加载js，并执行。
  #### 标记模块加载状态，下次使用直接返回已加载的模块
 
