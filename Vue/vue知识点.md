# MVVM 的理解

Mvvm 定义 MVVM 是 Model-View-ViewModel 的简写。即模型-视图-视图模型。【模型】指的是后端传递的数据。【视图】指的是所看到的页面。【视图模型】mvvm 模式的核心，它是连接 view 和 model 的桥梁。它有两个方向：一是将【模型】转化成【视图】，即将后端传递的数据转化成所看到的页面。实现的方式是：数据绑定。二是将【视图】转化成【模型】，即将所看到的页面转化成后端的数据。实现的方式是：DOM 事件监听。这两个方向都实现的，我们称之为数据的双向绑定。总结：在 MVVM 的框架下视图和模型是不能直接通信的。它们通过 ViewModel 来通信，ViewModel 通常要实现一个 observer 观察者，当数据发生变化，ViewModel 能够监听到数据的这种变化，然后通知到对应的视图做自动更新，而当用户操作视图，ViewModel 也能监听到视图的变化，然后通知数据做改动，这实际上就实现了数据的双向绑定。并且 MVVM 中的 View 和 ViewModel 可以互相通信。MVVM 流程图如下 <img src="./img/mvvm.jpg" ><img src="./img/vue-program.jpg">

# computed 与 watch 的区别

1、computed 是计算属性值，watch 是监听属性变化对数据的观察行为;

2、用法不同：computed 属性不能定义在 data 里面，并且有 get 和 set 方法，能够进行数据劫持。watch 的属性需要提前定义在 data 里面，普通监听只能监听简单数据，复杂数据需要使用深度监听 deep 配合 handler 方法，watch 要监听单个属性变化也可以通过 computed 昨晚中间转化 ;

3、computed 具有缓存性，页面重新渲染值不变化，计算属性会理解返回之前的结果，无需再次计算。watch 无缓存线，页面重新渲染是值不变化也会执行 ;

4、原理：两者都有一个 watcher 生成，不同的是 computed 的函数方法会被当做计算属性的 getter 调用

```
function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : createGetterInvoker(userDef);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get)
      : noop;
    sharedPropertyDefinition.set = userDef.set || noop;
  }
  // ........
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function createGetterInvoker(fn) {
  return function computedGetter () {
    return fn.call(this, this)
  }
}
```

5、computed 的过程：  
 a、按照 data 数据初始化 getter setter；  
 b、computed 计算属性初始化，提供的函数将用作 vm.key 的 getter 调用；  
 c、首次执行计算属性时，Dep 开始收集依赖；  
 d、在获取某个 key2 值的时候，如果 Dep 处于依赖收集状态，才判定 key2 为 key 的依赖，并通过 Wacther.depend 方法添加依赖关系；  
 e、当 key2 发生变化时，根据依赖关系，触发 key 的重新计算。


