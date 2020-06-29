# Vuex 有哪些东西

## 1、State：

    Vuex 使用的是单一状态树，用一个对象包含了全部的应用层级状态state。组件中使用state方法有 this.$store.state 或者通过辅助函数 mapState 配合computed 将state把state 映射到当前组件，注意mapState 传入的参数可以是多个state 组成的数组mapState([]),或者 mapState({})

## 2、Getters

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

## 3、Mutation

    Vuex 中state 的改变的唯一方法就是提交mutation，每个mutation 都有一个时间类型和一个回调函数，回调函数就是我们进行状态改变的地方，接受state 作为第一个参数
    ```
    mutations: {
        increment (state) {
            state.count++
        }
    }
    ```
    可通过 store.commit 来进行提交mutation 或者通过action 来提交

## 4、Action

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

## 5、Modules

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
    默认情况下，mutation，action，getters注册在全局命名空间。可以通过模块的namespaced 属性使模块称为到命名空间的模块。他的所有getter，action，mutation 都会自动根据模块注册的路径调整命名

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

# Vuex 工作机制
