#### computed 与 watch 的区别

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
a、按照data 数据初始化getter setter；
b、computed 计算属性初始化，提供的函数将用作 vm.key 的 getter 调用； 
c、首次执行计算属性时，Dep 开始收集依赖； 
d、在获取某个key2值的时候，如果Dep处于依赖收集状态，才判定key2 为key 的依赖，并通过Wacther.depend 方法添加依赖关系； 
e、当key2 发生变化时，根据依赖关系，触发key 的重新计算。