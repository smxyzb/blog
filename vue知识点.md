#### MVVM 的理解

Mvvm 定义 MVVM 是 Model-View-ViewModel 的简写。即模型-视图-视图模型。【模型】指的是后端传递的数据。【视图】指的是所看到的页面。【视图模型】mvvm 模式的核心，它是连接 view 和 model 的桥梁。它有两个方向：一是将【模型】转化成【视图】，即将后端传递的数据转化成所看到的页面。实现的方式是：数据绑定。二是将【视图】转化成【模型】，即将所看到的页面转化成后端的数据。实现的方式是：DOM 事件监听。这两个方向都实现的，我们称之为数据的双向绑定。总结：在 MVVM 的框架下视图和模型是不能直接通信的。它们通过 ViewModel 来通信，ViewModel 通常要实现一个 observer 观察者，当数据发生变化，ViewModel 能够监听到数据的这种变化，然后通知到对应的视图做自动更新，而当用户操作视图，ViewModel 也能监听到视图的变化，然后通知数据做改动，这实际上就实现了数据的双向绑定。并且 MVVM 中的 View 和 ViewModel 可以互相通信。MVVM 流程图如下 <img src="./img/mvvm.jpg" ><img src="./img/vue-program.jpg">

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
 a、按照 data 数据初始化 getter setter；  
 b、computed 计算属性初始化，提供的函数将用作 vm.key 的 getter 调用；  
 c、首次执行计算属性时，Dep 开始收集依赖；  
 d、在获取某个 key2 值的时候，如果 Dep 处于依赖收集状态，才判定 key2 为 key 的依赖，并通过 Wacther.depend 方法添加依赖关系；  
 e、当 key2 发生变化时，根据依赖关系，触发 key 的重新计算。

#### vuex 有哪些东西

### 1、State：

    Vuex 使用的是单一状态树，用一个对象包含了全部的应用层级状态state。组件中使用state方法有 this.$store.state 或者通过辅助函数 mapState 配合computed 将state把state 映射到当前组件，注意mapState 传入的参数可以是多个state 组成的数组mapState([]),或者 mapState({})

### 2、Getters

    Vuex允许我们在store 中定义getter，可以认为是store 的计算属性，与computed 类似，getter 的返回值会根据他的依赖被缓存起来，只有当他的依赖发生改变才会被重新计算；
    getter 接受state 为第一个参数

    ```
    getters: {
        doneTodos: state => {
        return state.todos.filter(todo => todo.done)
        }
    }
    ```
    可以提供辅助函数 mapGetters 用法与mapState 一样将getter 混入computed对象中，或者直接使用$store.getters.prop 进行访问

### 3、Mutation

    Vuex 中state 的改变的唯一方法就是提交mutation，每个mutation 都有一个时间类型和一个回调函数，回调函数就是我们进行状态改变的地方，接受state 作为第一个参数
    ```
    mutations: {
        increment (state) {
            state.count++
        }
    }
    ```
    可通过 store.commit 来进行提交mutation 或者通过action 来提交

### 4、Action

    Action 接受一个与store实例具有相同方法和属性的context 对象，因此可以通过context.commit 来提交一个mutation 或者使用context.state 和context.getters来获取state 和getters

    ```
    actions: {
        increment (context) {
            context.commit('increment')
        }
    }

    ```

    Action 与 mutation 类似不同的是： Action 提交的是 mutation，而不是直接变更状态； Action 可以包含任意异步操作；
    Action 可以通过store.dispatch 来触发，它可以提交多个mutation 。也可以通过辅助函数 mapActions 将action 映射到methods 中，通过this来进行调用
    store.dispatch 能够处理action 返回的Promise并且 store.dispatch 返回Promise，所以可以实现 store.dispatch().then()的链式调用或者async 与await 的组合写法

### 5、Modules

    当状态较多的时候，store 就会变得庞大，复杂。Vuex 允许我们将store 分割成模块，每个模块拥有自己的state ,mutation,action,getter 甚至嵌套子模块
    如下代码：
    ```
    const moduleA = {
    state: { ... },
    mutations: { ... },
    actions: { ... },
    getters: { ... }
    }

    const moduleB = {
    state: { ... },
    mutations: { ... },
    actions: { ... }
    }

    const store = new Vuex.Store({
    modules: {
        a: moduleA,
        b: moduleB
    }
    })

    ```
    模块内部mutation和getter 接收的第一个参数是模块内部的拒不状态对象
    对于 action，拒不状态通过context.state暴露出来，根节点则为context.rootState
    对于模块内部getter 根节点状态作为第三个参数暴露出来

    模块的命名空间 ：
    默认情况下，mutation，action，gettes注册在全局命名空间。可以通过模块的namespaced 属性使模块称为到命名空间的模块。他的所有getter，action，mutation 都会自动根据模块注册的路径调整命名

    ```
    modules: {
        account: {
            namespaced: true,

            // 模块内容（module assets）
            state: { ... }, // 模块内的状态已经是嵌套的了，使用 `namespaced` 属性不会对其产生影响
            getters: {
                isAdmin () { ... } // -> getters['account/isAdmin']
            },
            actions: {
                login () { ... } // -> dispatch('account/login')
            },
            mutations: {
                login () { ... } // -> commit('account/login')
            },
        }
    }
    ```
    模块高级用法见：https://vuex.vuejs.org/zh/guide/modules.html
