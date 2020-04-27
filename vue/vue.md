#### Vue 源码阅读记录

##说明：文中并不会对所有代码进行一一说明，只在关键的地方做主要说明，为了节省空间，所有贴代码的地方均会删除次要代码，具体以官方原始代码为准。

## \_functionname:文中类似的方法都是以 Vue 对象的私有方法出现的，大部分是通过 prototype 挂载到 Vue 对象上

## 文字打 html 注释的地方为出现大的代码段所载的文件路径

## 一、构建和检查

#1、检查：使用 flowjs 进行静态类型检查。  
#2、打包：使用 rollup 进行模块打包。

## 二、入口

#1、package.json 说明

```
    "main": "dist/vue.runtime.common.js",
    "module": "dist/vue.runtime.esm.js",
    "unpkg": "dist/vue.js",
    "jsdelivr": "dist/vue.js",
    "typings": "types/index.d.ts",
```

main：符合 CommonJS 模块规范的 vue.runtime.common.js 通过 module.exports 暴露 Vue 对象，CommonJS 版本为了那些还在使用 browserify 和 webpack1 的 bundler 提供的，默认 main 入口提供了仅包含 Runtime 的符合 CommonJS 规范的版本;  
module：符合 es 模块规范的 vue.runtime.esm.js ，通过 export default vue 暴露 Vue 对象，ES 模块版本是为了那些现代打包工具像 webpack2+ 或者 rollup，默认 module 入口提供了仅包含 Runtime 的符合 ES Module 规范的版本，所以在打包的时候会默认使用 vue.runtime.esm.js;  
unpkg/jsdelivr：UMD 模块规范的 vue.js，UMD 文件可以使用 script 标签直接引入 html 文件，默认从 Unpkg CDN 获取的文件就是 Runtime + Compiler 版本的 vue.js 文件 ;  
typings：支持 TypeScript 的类型定义文件 index.d.ts。

### 三、引入 Vue 的时候(new Vue 之前)做了什么

# 1、Vue 的初始化。

<!-- vue\src\core\instance\index.js -->

```
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue) // 初始化_init_方法
stateMixin(Vue) // Vue 的响应式代理
eventsMixin(Vue) //事件的初始化
lifecycleMixin(Vue) //生命周期初始化
renderMixin(Vue) // 私有 方法_render 的初始化

export default Vue
```

# 2、initMixin

<!-- vue\src\core\instance\init.js -->

```
export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // ... 省略部分代码
    if (process.env.NODE_ENV !== 'production') {
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
    // ... 省略部分代码
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```

可以看到 initMixin 给 vue 原型上挂在了一个 \_init 方法，该方法将会在组件初始化的时候调用

# 3、stateMixin

<!-- vue\src\core\instance\state.js -->

```
export function stateMixin (Vue: Class<Component>) {
 // ... 省略部分代码
  const dataDef = {}
  dataDef.get = function () { return this._data }
  const propsDef = {}
  propsDef.get = function () { return this._props }
  if (process.env.NODE_ENV !== 'production') {
    propsDef.set = function () {
      warn(`$props is readonly.`, this)
    }
  }
  Object.defineProperty(Vue.prototype, '$data', dataDef)
  Object.defineProperty(Vue.prototype, '$props', propsDef)

  Vue.prototype.$set = set
  Vue.prototype.$delete = del

  Vue.prototype.$watch = function (
    expOrFn: string | Function,
    cb: any,
    options?: Object
  ): Function {
    const vm: Component = this
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {}
    options.user = true
    const watcher = new Watcher(vm, expOrFn, cb, options)
    if (options.immediate) {
      try {
        cb.call(vm, watcher.value)
      } catch (error) {
        handleError(error, vm, `callback for immediate watcher "${watcher.expression}"`)
      }
    }
    return function unwatchFn () {
      watcher.teardown()
    }
  }
}
```

stateMixin 主要对 vue.prototype 进行拦截$data,$props 的获取，并给 Vue 添加 $set,$delete,\$watch 三个方法

# 4、eventsMixin

<!-- vue\src\core\instance\events.js -->

```
export function eventsMixin (Vue: Class<Component>) {
    Vue.prototype.$on = function () {...}
    Vue.prototype.$once = function () {...}
    Vue.prototype.$off = function () {...}
    Vue.prototype.$emit = function () {...}
}
```

eventsMixin 为 Vue 添加了$on,$once,#off,\$emit 四个事件方法

# 5、renderMixin

<!-- vue\src\core\instance\render.js -->

```
export function renderMixin (Vue: Class<Component>) {
    // install runtime convenience helpers
    installRenderHelpers(Vue.prototype)

    Vue.prototype.$nextTick = function (fn: Function) {
        return nextTick(fn, this)
    }

    Vue.prototype._render = function (): VNode {...}
}
```

renderMixin 同样是为 Vue 添加了 \$nextTick ，\_render 私有方法

### 四、new Vue 的时候做了哪些事情

<!-- vue\src\core\instance\index.js -->

再来看一次

```
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}
```

1、创建实例： 当我们调用 new Vue 的时候，首选对环境作了判断，并且检查当前 this 是不是 Vue 的实例，如果是 Vue 的实例，则提示错误。这就是<strong>为什么我们必须使用 new 来创建实例</strong>的原因。

2、调用了\_init 方法：

<!-- vuecode\node_modules\vue\src\core\instance\init.js -->

```
Vue.prototype._init = function (options?: Object) {
    // ...
    if (process.env.NODE_ENV !== 'production') {
        // 这里主要对vm进行了一个拦截设置
        initProxy(vm)
    } else {
        vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm
    initLifecycle(vm)
    initEvents(vm)
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')
    if (vm.$options.el) {
        // 见 \vue\src\platforms\web\runtime\index.js
        vm.$mount(vm.$options.el)
    }
}
```

首先 initLifecycle 完成对 vue 实例的一些基本属性的初始赋值

<!-- vuecode\node_modules\vue\src\core\instance\lifecycle.js -->

```
    vm.$parent = parent
    vm.$root = parent ? parent.$root : vm
    vm.$children = []
    vm.$refs = {}
    vm._watcher = null
    vm._inactive = null
    vm._directInactive = false
    vm._isMounted = false
    vm._isDestroyed = false
    vm._isBeingDestroyed = false
```

initEvents 主要做的是$once,$on,$off,$emit 事件的初始化

<!-- vue\src\core\instance\events.js -->

initRender 主要对 vm 实例进行一些响应式绑定--defineReactive

<!-- vue\src\core\instance\render.js -->

```
if (process.env.NODE_ENV !== 'production') {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$attrs is readonly.`, vm)
    }, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, () => {
      !isUpdatingChildComponent && warn(`$listeners is readonly.`, vm)
    }, true)
  } else {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true)
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true)
  }
```

# 然后 callHook 调用了 beforeCreate 方法

initInjections 主要是对注入的数据进行了响应式的绑定操作

<!-- vue\src\core\instance\inject.js -->

```
if (result) {
    toggleObserving(false)
    Object.keys(result).forEach(key => {
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production') {
        defineReactive(vm, key, result[key], () => {
          warn(
            `Avoid mutating an injected value directly since the changes will be ` +
            `overwritten whenever the provided component re-renders. ` +
            `injection being mutated: "${key}"`,
            vm
          )
        })
      } else {
        defineReactive(vm, key, result[key])
      }
    })
```

initState 主要对组件中的 props，methods，data ，进行了初始化，并且对 data 实行响应式绑定和监听变化

<!-- vue\src\core\instance\state.js -->

initProvide 初始化 provide 数据，并挂载到对于的 vm 实例上

# 然后 callHook 调用 created 方法 ，到此整个实例已经创建完成，但是并未挂载到具体实例上。接下来看\_init 方法的最后

    ```
    if (vm.$options.el) {
        vm.$mount(vm.$options.el)
    }
    ```

这里对实例的传入的参数做了判断，如果传入了 el 则将 vm 实例挂载到对应的 el 元素上

<!-- $amout vue\src\platforms\web\runtime\index.js -->

\$amout 方法会调用 mountComponent

<!-- mountComponent  vue\src\core\instance\lifecycle.js -->

```
callHook(vm, 'beforeMount')

if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
  updateComponent = () => {
    const name = vm._name
    const id = vm._uid
    const startTag = `vue-perf-start:${id}`
    const endTag = `vue-perf-end:${id}`

    mark(startTag)
    const vnode = vm._render()
    mark(endTag)
    measure(`vue ${name} render`, startTag, endTag)

    mark(startTag)
    vm._update(vnode, hydrating)
    mark(endTag)
    measure(`vue ${name} patch`, startTag, endTag)
  }
} else {
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }
}

// we set this to vm._watcher inside the watcher's constructor
// since the watcher's initial patch may call $forceUpdate (e.g. inside child
// component's mounted hook), which relies on vm._watcher being already defined
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
hydrating = false

// manually mounted instance, call mounted on self
// mounted is called for render-created child components in its inserted hook
if (vm.$vnode == null) {
  vm._isMounted = true
  callHook(vm, 'mounted')
}
return vm

```

这里面首先调用了 beforeMount 生命周期，接下来生成一个 updateComponent 方法，核心就是创建一个 Watcher 实例，把 updateComponent 作为 watcher 实例的回到函数，首次的时候会执行回调函数，并且当 vm 上的数据变化的时候将会调用 updateComponent 方法，调用 vm.\_render 方法先生成虚拟 Node，最终调用 vm.\_update 更新 DOM. 进行页面更新操作。至此整个实例已经挂载到 app 上，然后对当前实例打上了\_isMounted 标记，表示已经挂载过了，并调用了 mounted 生命周期，返回实例对象

### 总结：

new Vue 做了那些事情？ 1、beforeCreate 阶段：vm 实例的基本属性对的初始化，初始化事件，对 vm 的响应式绑定； 2、created 阶段：对组件的 props，data，inject 注入，provide 数据进行响应式的绑定，methods 方法绑定到对于实例上； 3、mounted ：调用\$amount 方法，并触发 beforeMount 生命周期，生成 updateComponent 更新方法 ，创建 Watcher 实例，并调用\_update 更新，以便在数据变化对的时候触发对于的更新；

### 五、\_render 方法是干什么？

1、\_render 方法是一个私有方法，它会把当前实例生成一个虚拟 Node

<!-- vue\src\core\instance\render.js -->

```
Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options
    // ...
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      currentRenderingInstance = vm
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      if (process.env.NODE_ENV !== 'production' && vm.$options.renderError) {
        try {
          vnode = vm.$options.renderError.call(vm._renderProxy, vm.$createElement, e)
        } catch (e) {
          handleError(e, vm, `renderError`)
          vnode = vm._vnode
        }
      } else {
        vnode = vm._vnode
      }
    } finally {
      currentRenderingInstance = null
    }
    // if the returned array contains only a single node, allow it
    if (Array.isArray(vnode) && vnode.length === 1) {
      vnode = vnode[0]
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      if (process.env.NODE_ENV !== 'production' && Array.isArray(vnode)) {
        warn(
          'Multiple root nodes returned from render function. Render function ' +
          'should return a single root node.',
          vm
        )
      }
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
```

通常我们在组建中可能会这样写，这在 iview ，elementui 里面随处可见

```
 render:function(createElement){
     return createElement('span',{attrs:{id:'test'}})
 }
```

结合以下代码段：

```
vnode = render.call(vm._renderProxy, vm.$createElement)
```

可以看出 参数 createElement 作为返回的回调函数，他其实就是 vm.\$createElement 方法，而该方法在 initRender 中就已经定义好了

```
export function initRender (vm: Component) {
  vm._vnode = null // the root of the child tree
  vm._staticTrees = null // v-once cached trees
  const options = vm.$options
  const parentVnode = vm.$vnode = options._parentVnode // the placeholder node in parent tree
  const renderContext = parentVnode && parentVnode.context
  vm.$slots = resolveSlots(options._renderChildren, renderContext)
  vm.$scopedSlots = emptyObject
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = (a, b, c, d) => createElement(vm, a, b, c, d, true)
}
```

我们看到还有一个\_c 方法，两者的参数相同，并同时调用了 createElement 方法，在 createElement 中会生成 vNode。

### 总结：\_render 方法最终就是通过 createElement 生成 vNode 虚拟 DOM。

### 六、虚拟 DOM （Virtual DOM）

```
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  fnContext: Component | void; // real context vm for functional nodes
  fnOptions: ?ComponentOptions; // for SSR caching
  devtoolsMeta: ?Object; // used to store functional render context for devtools
  fnScopeId: ?string; // functional scope id support

  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
    this.elm = elm
    this.ns = undefined
    this.context = context
    this.fnContext = undefined
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key
    this.componentOptions = componentOptions
    this.componentInstance = undefined
    this.parent = undefined
    this.raw = false
    this.isStatic = false
    this.isRootInsert = true
    this.isComment = false
    this.isCloned = false
    this.isOnce = false
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  // DEPRECATED: alias for componentInstance for backwards compat.
  /* istanbul ignore next */
  get child (): Component | void {
    return this.componentInstance
  }
}
```

1、vNode children （此处参考 https://ustbhuangyi.github.io/vue-analysis/data-driven/create-element.html#children-%E7%9A%84%E8%A7%84%E8%8C%83%E5%8C%96） \_createElement 接受了 5 个参数，context 表示 VNode 的上下文环境，它是 Component 类型；tag 表示标签，它可以是一个字符串，也可以是一个 Component；data 表示 VNode 的数据，它是一个 VNodeData 类型，可以在 flow/vnode.js 中找到它的定义，这里先不展开说；children 表示当前 VNode 的子节点，它是任意类型的，它接下来需要被规范为标准的 VNode 数组；normalizationType 表示子节点规范的类型，类型不同规范的方法也就不一样，它主要是参考 render 函数是编译生成的还是用户手写的。

2、createElement 与 \_createElement： createElement 对——createElement 进行了二次封装，内部里面调用了\_createElement <!-- vue\src\core\vdom\create-element.js -->

```

function _createElement (
    context: Component,
    tag?: string | Class<Component> | Function | Object,
    data?: VNodeData,
    children?: any,
    normalizationType?: number
    ): VNode | Array<VNode> {
        if (isDef(data) && isDef((data: any).__ob__)) {
            process.env.NODE_ENV !== 'production' && warn(
            `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
            'Always create fresh vnode data objects in each render!',
            context
            )
            return createEmptyVNode()
        }
        // object syntax in v-bind
        if (isDef(data) && isDef(data.is)) {
            tag = data.is
        }
        if (!tag) {
            // in case of component :is set to falsy value
            return createEmptyVNode()
        }
        // warn against non-primitive key
        if (process.env.NODE_ENV !== 'production' &&
            isDef(data) && isDef(data.key) && !isPrimitive(data.key)
        ) {
        if (!__WEEX__ || !('@binding' in data.key)) {
            warn(
                'Avoid using non-primitive value as key, ' +
                'use string/number value instead.',
                context
            )
            }
        }
        // support single function children as default scoped slot
        if (Array.isArray(children) &&
            typeof children[0] === 'function'
        ) {
            data = data || {}
            data.scopedSlots = { default: children[0] }
            children.length = 0
        }
        if (normalizationType === ALWAYS_NORMALIZE) {
            children = normalizeChildren(children)
        } else if (normalizationType === SIMPLE_NORMALIZE) {
            children = simpleNormalizeChildren(children)
        }
        let vnode, ns;

        // 如果 tag 是普通的html 标签则创建vNode
        if (typeof tag === 'string') {
            let Ctor
            ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
            if (config.isReservedTag(tag)) {
            // platform built-in elements
            if (process.env.NODE_ENV !== 'production' && isDef(data) && isDef(data.nativeOn)) {
                warn(
                `The .native modifier for v-on is only valid on components but it was used on <${tag}>.`,
                context
                )
            }
            vnode = new VNode(
                config.parsePlatformTagName(tag), data, children,
                undefined, undefined, context
            )
            //  否则 则创建并编译组件
        } else if ((!data || !data.pre) && isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
            // component
            vnode = createComponent(Ctor, data, context, children, tag)
        } else {
            // unknown or unlisted namespaced elements
            // check at runtime because it may get assigned a namespace when its
            // parent normalizes children
            vnode = new VNode(
                tag, data, children,
                undefined, undefined, context
            )
        }
    } else {
        // direct component options / constructor
        vnode = createComponent(tag, data, context, children)
    }

    if (Array.isArray(vnode)) {
        return vnode
    } else if (isDef(vnode)) {
        if (isDef(ns)) applyNS(vnode, ns)
        if (isDef(data)) registerDeepBindings(data)
        return vnode
    } else {
        return createEmptyVNode()
    }
  }
```

<!-- vue\src\core\vdom\vnode.js -->

\_createElement 接收的第 4 个参数 children 是任意类型的，因此我们需要把它们规范成 VNode 类型。这里根据 normalizationType 的不同，调用了 normalizeChildren(children) 和 simpleNormalizeChildren(children) 方法。

 <!--src/core/vdom/helpers/normalzie-children.js  -->

simpleNormalizeChildren 方法调用场景是： render 函数是编译生成的 normalizeChildren 方法的调用场景有 2 种，一个场景是 render 函数是用户手写的，当 children 只有一个节点的时候，Vue.js 从接口层面允许用户把 children 写成基础类型用来创建单个简单的文本节点，这种情况会调用 createTextVNode 创建一个文本节点的 VNode；另一个场景是当编译 slot、v-for 的时候会产生嵌套数组的情况，会调用 normalizeArrayChildren 方法

###七、组件的实例化

1、createComponent

```

export function createComponent (
  Ctor: Class<Component> | Function | Object | void,
  data: ?VNodeData,
  context: Component,
  children: ?Array<VNode>,
  tag?: string
): VNode | Array<VNode> | void {
  if (isUndef(Ctor)) {
    return
  }

  const baseCtor = context.$options._base

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor)
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    if (process.env.NODE_ENV !== 'production') {
      warn(`Invalid Component definition: ${String(Ctor)}`, context)
    }
    return
  }

  // async component
  let asyncFactory
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor)
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {}

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor)

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data)
  }

  // extract props
  const propsData = extractPropsFromVNodeData(data, Ctor, tag)

  // functional component
  // createFunctionalComponent 将会生成一个函数式的组件，会把 抽象语法树生成的 render字符串转换成 render function ，供 _render 调用；
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  const listeners = data.on
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    const slot = data.slot
    data = {}
    if (slot) {
      data.slot = slot
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data)

  // return a placeholder vnode
  const name = Ctor.options.name || tag
  const vnode = new VNode(
    `vue-component-${Ctor.cid}${name ? `-${name}` : ''}`,
    data, undefined, undefined, undefined, context,
    { Ctor, propsData, listeners, tag, children },
    asyncFactory
  )

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  if (__WEEX__ && isRecyclableComponent(vnode)) {
    return renderRecyclableComponentTemplate(vnode)
  }

  return vnode
}

```

createComponent 主要做了三件事：

1）构建子组件构造函数:

```
const baseCtor = context.$options._base
if (isObject(Ctor)) { Ctor = baseCtor.extend(Ctor) }

```

这里的 \_base 其实就是 Vue 对象，在 global-api 中。相当于调用了 Vue.extend 方法

<!-- vue\src\core\global-api\index.js -->

```
Vue.options._base = Vue
```

Vue.extend 在 global-api extend 中

```

Vue.extend = function (extendOptions: Object): Function {
    extendOptions = extendOptions || {}
    const Super = this
    const SuperId = Super.cid
    const cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {})
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    const name = extendOptions.name || Super.options.name
    if (process.env.NODE_ENV !== 'production' && name) {
      validateComponentName(name)
    }

    const Sub = function VueComponent (options) {
      this._init(options)
    }
    Sub.prototype = Object.create(Super.prototype)
    Sub.prototype.constructor = Sub
    Sub.cid = cid++
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    )
    Sub['super'] = Super

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps(Sub)
    }
    if (Sub.options.computed) {
      initComputed(Sub)
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend
    Sub.mixin = Super.mixin
    Sub.use = Super.use

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type]
    })
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options
    Sub.extendOptions = extendOptions
    Sub.sealedOptions = extend({}, Sub.options)

    // cache constructor
    cachedCtors[SuperId] = Sub
    return Sub
  }
}

```

extend 方法 返回了一个 Sub 对象，extend 方法将 Vue 的私有方法\_init 挂载到 Sub、 对象上，并且将 Vue 的一些原型方法、options 等等全都挂载到 Sub 上，。同时也对传入的 props，计算属性进行了初始化。这里相当于新生成了一个 Vue 的实例对象，同时也保证了在当前组件下能够使用其他组件，因为所有的组件都拥有同样的方法，但是每个实例的 props，计算属性这些也都是私有的。比如 initProps( Sub) 只会对当前实例进行初始化。

2）安装组件钩子函数:

```
installComponentHooks(data)


```

在 installComponentHooks 中

```
const componentVNodeHooks = {
  init (vnode: VNodeWithData, hydrating: boolean): ?boolean {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      const mountedNode: any = vnode // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode)
    } else {
      const child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance
      )
      child.$mount(hydrating ? vnode.elm : undefined, hydrating)
    }
  },

  prepatch (oldVnode: MountedComponentVNode, vnode: MountedComponentVNode) {
    const options = vnode.componentOptions
    const child = vnode.componentInstance = oldVnode.componentInstance
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    )
  },

  insert (vnode: MountedComponentVNode) {
    const { context, componentInstance } = vnode
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true
      callHook(componentInstance, 'mounted')
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance)
      } else {
        activateChildComponent(componentInstance, true /* direct */)
      }
    }
  },

  destroy (vnode: MountedComponentVNode) {
    const { componentInstance } = vnode
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy()
      } else {
        deactivateChildComponent(componentInstance, true /* direct */)
      }
    }
  }
}


const hooksToMerge = Object.keys(componentVNodeHooks)

function installComponentHooks (data: VNodeData) {
  const hooks = data.hook || (data.hook = {})
  for (let i = 0; i < hooksToMerge.length; i++) {
    const key = hooksToMerge[i]
    const existing = hooks[key]
    const toMerge = componentVNodeHooks[key]
    if (existing !== toMerge && !(existing && existing._merged)) {
      hooks[key] = existing ? mergeHook(toMerge, existing) : toMerge
    }
  }
}

function mergeHook (f1: any, f2: any): Function {
  const merged = (a, b) => {
    // flow complains about extra args which is why we use any
    f1(a, b)
    f2(a, b)
  }
  merged._merged = true
  return merged
}
```

安装钩子函数 主要把 componentVNodeHooks 三个方法添加到当前组件的 vNode 上： init： 方法对组件是 Keep-live 进行了判断，如果缓存则直接进行 prepatch ，先更新子组件，否则就创建一个实例，并且将改实例挂载到父组件上(child.$mount())。
prepatch ：更新子组件
destroy：先判断组件是否销毁 isDestroyed ，如果是并且组件KeepLive 是false 则直接调用当前组件的生命周期 $destroy，执行销毁动作。否则 销毁子组件 deactivateChildComponent 方法会递归子组件并一个个地销毁它们

3）实例化一个 vNode，最终返回 Vnode，到此组件创建完成。

2、紧接上一步的 init ，最后执行了 child.$amout 方法，实际上就是Vue.$amout

回到之前的 \$mount 方法

<!-- vue\src\platforms\web\runtime\index.js -->

```
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

```

中间有个过程 mountComponent => updateComponent => \_update => \_render

```
updateComponent = () => {
    vm._update(vm._render(), hydrating)
}

```

前面已经了解过 \_render 方法最终生成 vNode，生成完成后当 供\_update 使用

3、渲染 \_update 首先回到私有方法 \_init

```
 Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // ......
    // a flag to avoid this being observed
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    //......
 }

// vue\src\core\instance\init.js

export function initInternalComponent (vm: Component, options: InternalComponentOptions) {
  const opts = vm.$options = Object.create(vm.constructor.options)
  // doing this because it's faster than dynamic enumeration.
  const parentVnode = options._parentVnode
  opts.parent = options.parent
  opts._parentVnode = parentVnode

  const vnodeComponentOptions = parentVnode.componentOptions
  opts.propsData = vnodeComponentOptions.propsData
  opts._parentListeners = vnodeComponentOptions.listeners
  opts._renderChildren = vnodeComponentOptions.children
  opts._componentTag = vnodeComponentOptions.tag

  if (options.render) {
    opts.render = options.render
    opts.staticRenderFns = options.staticRenderFns
  }
}

```

\_init 对当前传入的参数做了判断，如果是组件，则只执行 initInternalComponent 并把当前实例 vm 和参数 options 传入,设置当前 vm 为父组件，并把 options 合并到 vm.\$options 上来。

<!-- vue\src\core\instance\lifecycle.js -->

```
Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    <!-- 这里的vnode 是通过 _render 生成并返回的vNode -->
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl)
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }

export let activeInstance: any = null
export let isUpdatingChildComponent: boolean = false

export function setActiveInstance(vm: Component) {
  const prevActiveInstance = activeInstance
  activeInstance = vm
  return () => {
    activeInstance = prevActiveInstance
  }
}

```

这里的 利用必报的形式先保存了当前组件的父组件实例 prevActiveInstance。activeInstance 为当前正在处理更新的组件实例，patch 开始后 ，全局 activeInstance 即当前正在处理更新的 vm 在 patch 完成后 执行 activeInstance = prevActiveInstance 又把当前激活的 vm 实例设置成 prevActiveInstance。这样就完美地保证了 createComponentInstanceForVnode 整个深度遍历过程中，我们在实例化子组件的时候能传入当前子组件的父 Vue 实例，并在 Vue.\_init 的过程中，通过 vm.\$parent 把这个父子关系保留。

###八、渲染 **patch**

<!-- vue\src\platforms\web\runtime\index.js -->

```
Vue.prototype.__patch__ = inBrowser ? patch : noop

```

只有在浏览器里面才会进行 patch

<!-- vue\src\platforms\web\runtime\patch.js -->

<!-- vue\src\core\vdom\patch.js -->

````
export const patch: Function = createPatchFunction({ nodeOps, modules })

export function createPatchFunction(backend) {
    // ......
    return function patch(oldVnode, vnode, hydrating, removeOnly) {
        if (isUndef(vnode)) {
            if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
            return
        }

        let isInitialPatch = false
        const insertedVnodeQueue = []

        if (isUndef(oldVnode)) {
            // empty mount (likely as component), create new root element
            isInitialPatch = true
            createElm(vnode, insertedVnodeQueue)
        } else {
            const isRealElement = isDef(oldVnode.nodeType)
            if (!isRealElement && sameVnode(oldVnode, vnode)) {
                // patch existing root node
                patchVnode(oldVnode, vnode, insertedVnodeQueue, null, null, removeOnly)
            } else {
                // .......

                // replacing existing element
                const oldElm = oldVnode.elm
                const parentElm = nodeOps.parentNode(oldElm)

                // create new node
                createElm(
                    vnode,
                    insertedVnodeQueue,
                    // extremely rare edge case: do not insert if old element is in a
                    // leaving transition. Only happens when combining transition +
                    // keep-alive + HOCs. (#4590)
                    oldElm._leaveCb ? null : parentElm,
                    nodeOps.nextSibling(oldElm)
                )

                // ........
            }
        }

        invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
        return vnode.elm
    }
    ```
    这里先都调用了createEle 方法，它主要通过原生方法生成真实 的dom 元素

    ```
    function createElm(
        vnode,
        insertedVnodeQueue,
        parentElm,
        refElm,
        nested,
        ownerArray,
        index
    ) {
        if (isDef(vnode.elm) && isDef(ownerArray)) {
            // This vnode was used in a previous render!
            // now it's used as a new node, overwriting its elm would cause
            // potential patch errors down the road when it's used as an insertion
            // reference node. Instead, we clone the node on-demand before creating
            // associated DOM element for it.
            vnode = ownerArray[index] = cloneVNode(vnode)
        }

        vnode.isRootInsert = !nested // for transition enter check
        if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
            return
        }

        const data = vnode.data
        const children = vnode.children
        const tag = vnode.tag
        if (isDef(tag)) {
            if (process.env.NODE_ENV !== 'production') {
                if (data && data.pre) {
                    creatingElmInVPre++
                }
                if (isUnknownElement(vnode, creatingElmInVPre)) {
                    warn(
                        'Unknown custom element: <' + tag + '> - did you ' +
                        'register the component correctly? For recursive components, ' +
                        'make sure to provide the "name" option.',
                        vnode.context
                    )
                }
            }

            vnode.elm = vnode.ns
                ? nodeOps.createElementNS(vnode.ns, tag)
                : nodeOps.createElement(tag, vnode)
            setScope(vnode)

            /* istanbul ignore if */
            if (__WEEX__) {
                // in Weex, the default insertion order is parent-first.
                // List items can be optimized to use children-first insertion
                // with append="tree".
                const appendAsTree = isDef(data) && isTrue(data.appendAsTree)
                if (!appendAsTree) {
                    if (isDef(data)) {
                        invokeCreateHooks(vnode, insertedVnodeQueue)
                    }
                    insert(parentElm, vnode.elm, refElm)
                }
                createChildren(vnode, children, insertedVnodeQueue)
                if (appendAsTree) {
                    if (isDef(data)) {
                        invokeCreateHooks(vnode, insertedVnodeQueue)
                    }
                    insert(parentElm, vnode.elm, refElm)
                }
            } else {
                createChildren(vnode, children, insertedVnodeQueue)
                if (isDef(data)) {
                    invokeCreateHooks(vnode, insertedVnodeQueue)
                }
                insert(parentElm, vnode.elm, refElm)
            }

            if (process.env.NODE_ENV !== 'production' && data && data.pre) {
                creatingElmInVPre--
            }
        } else if (isTrue(vnode.isComment)) {
            vnode.elm = nodeOps.createComment(vnode.text)
            insert(parentElm, vnode.elm, refElm)
        } else {
            vnode.elm = nodeOps.createTextNode(vnode.text)
            insert(parentElm, vnode.elm, refElm)
        }
    }
    ```
    首先 在 createComponent 中，如果vnode.data 存在，并且组件实例存在，那么返回true ，说明是一个组件，不再往下执行;

    疑问：为什么在这里 return ？
        个人猜测在床组件后，不是直接进行dom 渲染，直接返回。应该是要等待组件的 _update 方法执行的时候才会进行渲染。

    当父组件元素是普通标签时候，通过 createChildren 优先生产子组件dom，最后通过 insert 插入父组件。


###九、组件的编译（compile）

    1、概念：抽象语法树AST
        抽象语法树（Abstract Syntax Tree）也称为AST语法树，指的是源代码语法所对应的树状结构。也就是说，对于一种具体编程语言下的源代码，通过构建语法树的形式将源代码中的语句映射到树中的每一个节点上。

    2、编译器 compiler
    <!-- vue\src\platforms\web\entry-runtime-with-compiler.js -->
    ```
    Vue.prototype.$mount = function (
        el?: string | Element,
        hydrating?: boolean
    ): Component {
        el = el && query(el)

        /* istanbul ignore if */
        if (el === document.body || el === document.documentElement) {
            process.env.NODE_ENV !== 'production' && warn(
                `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
            )
            return this
        }

        const options = this.$options
        // resolve template/el and convert to render function
        if (!options.render) {
            let template = options.template
            if (template) {
                if (typeof template === 'string') {
                    if (template.charAt(0) === '#') {
                        template = idToTemplate(template)
                        /* istanbul ignore if */
                        if (process.env.NODE_ENV !== 'production' && !template) {
                            warn(
                                `Template element not found or is empty: ${options.template}`,
                                this
                            )
                        }
                    }
                } else if (template.nodeType) {
                    template = template.innerHTML
                } else {
                    if (process.env.NODE_ENV !== 'production') {
                        warn('invalid template option:' + template, this)
                    }
                    return this
                }
            } else if (el) {
                template = getOuterHTML(el)
            }
            if (template) {
                /* istanbul ignore if */
                if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
                    mark('compile')
                }

                const { render, staticRenderFns } = compileToFunctions(template, {
                    outputSourceRange: process.env.NODE_ENV !== 'production',
                    shouldDecodeNewlines,
                    shouldDecodeNewlinesForHref,
                    delimiters: options.delimiters,
                    comments: options.comments
                }, this)
                options.render = render
                options.staticRenderFns = staticRenderFns

                /* istanbul ignore if */
                if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
                    mark('compile end')
                    measure(`vue ${this._name} compile`, 'compile', 'compile end')
                }
            }
        }
        return mount.call(this, el, hydrating)
    }
    ```
    Vue.$mount 会对模板进行编译 ，依赖收集 ，此处只说编译。compileToFunctions 的作用就是讲template 编译成函数形式的render和staticRenderFns方法；
    依次进入
     <!-- vue\src\platforms\web\compiler\index.js -->
     <!-- vue\src\compiler\index.js -->
    compileToFunctions 调用了 createCompiler，这里编译正式开始：
    ```
    export const createCompiler = createCompilerCreator(function baseCompile (
        template: string,
        options: CompilerOptions
        ): CompiledResult {
        const ast = parse(template.trim(), options)
        if (options.optimize !== false) {
            optimize(ast, options)
        }
        const code = generate(ast, options)
        return {
            ast,
            render: code.render,
            staticRenderFns: code.staticRenderFns
        }
    })

    // vue\src\compiler\create-compiler.js
    export function createCompilerCreator(baseCompile: Function): Function {
        return function createCompiler(baseOptions: CompilerOptions) {
            function compile(
                template: string,
                options?: CompilerOptions
            ): CompiledResult {
                const finalOptions = Object.create(baseOptions)
                const errors = []
                const tips = []

                let warn = (msg, range, tip) => {
                    (tip ? tips : errors).push(msg)
                }
                // ......
                finalOptions.warn = warn
                const compiled = baseCompile(template.trim(), finalOptions)
                if (process.env.NODE_ENV !== 'production') {
                    detectErrors(compiled.ast, warn)
                }
                compiled.errors = errors
                compiled.tips = tips
                return compiled
            }

            return {
                compile,
                compileToFunctions: createCompileToFunctionFn(compile)
            }
        }
    }

    //这里看的有点晕 ，合起来就是
    createCompiler = createCompilerCreator(baseCompile){
        return function createCompiler(){
            function compile(
                template: string,
                options?: CompilerOptions
            ): CompiledResult {
                const finalOptions = Object.create(baseOptions)
                const errors = []
                const tips = []

                let warn = (msg, range, tip) => {
                    (tip ? tips : errors).push(msg)
                }
                // ......
                finalOptions.warn = warn
                const compiled = baseCompile(template.trim(), finalOptions)
                if (process.env.NODE_ENV !== 'production') {
                    detectErrors(compiled.ast, warn)
                }
                compiled.errors = errors
                compiled.tips = tips
                return compiled
            }
            return {
                compile,
                compileToFunctions: createCompileToFunctionFn(compile)
            }
        }
    }

    ```
    执行顺序是 compileToFunctions => createCompilerCreator => createCompilerCreator 内部的createCompiler => baseCompile

    createCompiler 以必报的形式，最终返回了一个 createCompiler 方法。改方法接收一个template 字符串，和一个options 参数，template 就是我们平时写组件时候的内容;
    options 是一些列基本配置参数 在 <!-- vue\src\platforms\web\compiler\options.js --> 中可以看到

    首先就对template 字符串进行了转换，通过 parse 方法讲template 字符串转换成 ast 抽象语法树
    ```
        const ast = parse(template.trim(), options)
    ```

    3、ast 抽象语法树的转换
    ```
    <!-- vue\src\compiler\parser -->

    export function parse(
        template: string,
        options: CompilerOptions
    ): ASTElement | void {
        let root;
        // ...
        parseHTML(template, {
            //....
           start(tag, attrs, unary, start, end) {
            // check namespace.
            // inherit parent ns if there is one
            const ns = (currentParent && currentParent.ns) || platformGetTagNamespace(tag)

            // handle IE svg bug
            /* istanbul ignore if */
            if (isIE && ns === 'svg') {
                attrs = guardIESVGBug(attrs)
            }

            let element: ASTElement = createASTElement(tag, attrs, currentParent)
            if (ns) {
                element.ns = ns
            }

            if (!inVPre) {
                processPre(element)
                if (element.pre) {
                    inVPre = true
                }
            }
            if (platformIsPreTag(element.tag)) {
                inPre = true
            }
            if (inVPre) {
                processRawAttrs(element)
            } else if (!element.processed) {
                // structural directives
                processFor(element)
                processIf(element)
                processOnce(element)
            }
            // ....

        }，
        end(tag, start, end) {},

        comment(text: string, start, end) {}
    )
        // ....
        return root
    }

    // 创建 ast 对象
    export function createASTElement(
        tag: string,
        attrs: Array<ASTAttr>,
        parent: ASTElement | void
    ): ASTElement {
        return {
            type: 1,
            tag,
            attrsList: attrs,
            attrsMap: makeAttrsMap(attrs),
            rawAttrsMap: {},
            parent,
            children: []
        }
    }
    ```
    start 会对template 字符串进行解析，匹配并生成开始标签名称。 end 左右是匹配生成闭合标签。comment 是注释

    ast 创建完成后

    ```
    const code = generate(ast, options)

    // 来看下 generate 方法
    // vue\src\compiler\codegen\index.js
    export function generate (
        ast: ASTElement | void,
        options: CompilerOptions
        ): CodegenResult {
        const state = new CodegenState(options)
        const code = ast ? genElement(ast, state) : '_c("div")'
        return {
            render: `with(this){return ${code}}`,
            staticRenderFns: state.staticRenderFns
        }
    }
    最后返回一个包含 render 和 staticRenderFns 字段的对象。
    ```
    说明：with 通常被当做重复引用同一个对象中的多个属性的快捷方式，可以不需要重复引用对象本身；
    ```
        var obj = {
            a: 1,
            b: 2,
            c: 3
        }
        //可以写成

        with (obj) {
            a = 3;
            b = 4;
            c = 5;
        }
    ```

    genElement 对ast 又进行了一次 编译，处理一些vue的语法，比如v-if，v-for ，directives 等等，以及子组件的编译。

    我们看到 在ast不存在的时候，是直接返回了一个 '_c("div")',这里的 _c 就是我们一开始 initRender 里面创建的那个 _c

    ```
         // initRender function
         vm._c = (a, b, c, d) => createElement(vm, a, b, c, d, false)
    ```
    整个调用过程(都是函数名称)：ast = createCompiler  -> compile -> parse -> parseHTML ->baseCompile
       -> generate(ast )

    执行顺序确实反过来的 ，其中 createCompiler 最后返回 一个包含 createCompileToFunctionFn 的方法，它内部把 generate 生成的 render 字符串转换成了 render function
    ```
    function createFunction (code, errors) {
        try {
            return new Function(code)
        } catch (err) {
            errors.push({ err, code })
            return noop
        }
    }

    ```
    这样一来，整个template 就转换成了一个可供调用的 render function


    再回到 $amount 方法，在生成 ast 完成后
    ```
        const { render, staticRenderFns } = compileToFunctions(template, {
                outputSourceRange: process.env.NODE_ENV !== 'production',
                shouldDecodeNewlines,
                shouldDecodeNewlinesForHref,
                delimiters: options.delimiters,
                comments: options.comments
            }, this)
        options.render = render
        options.staticRenderFns = staticRenderFns

    ```
    render 方法和 staticRenderFns 均被赋给了 options ，这样一来当前组件的 template 内容就 以options 的形式挂载到当前组件的实例上去了。

    到此，组件编译完成。




二、Watcher
1、构造函数
   首先对Vue 进行一些前期构造，即在原型上添加一些方法 Vue.prototype.* = function () {}


//4051 行
function Vue$3 (options) {
  if ("development" !== 'production' &&
    !(this instanceof Vue$3)) {
    warn('Vue is a constructor and should be called with the `new` keyword');
  }
  this._init(options);
}



initMixin(Vue$3);//这里为Vue 加了一个_init 方法
stateMixin(Vue$3);
eventsMixin(Vue$3);
lifecycleMixin(Vue$3);

renderMixin(Vue$3);
//3920 行
function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;

    // .........
    {
      initProxy(vm); //看下一个函数
    }
    vm._self = vm;//自身实例，后面的操作都在这个实例上进行
    initLifecycle(vm);//生命周期初始化
    initEvents(vm);//事件初始化($on,$off,$emit等)
    initRender(vm);//初始化渲染函数,在vm上绑定 $createElement 方法
    callHook(vm, 'beforeCreate'); // beforeCreate执行
    initInjections(vm); // resolve injections before data/props
    initState(vm); //添加对data 的监听
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');// created 执行
    /* istanbul ignore if */
    if ("development" !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false);
      mark(endTag);
      measure(((vm._name) + " init"), startTag, endTag);
    }

    //挂载vm，vm完成组件编译，虚拟dom生成，更新
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }

   //可以看出初始化顺序是:初始化生命周期 -> 事件 -> 'beforeCreate' 的回调 -> 注入初始化( 2.2.0 新增) -> 状态初始化 -> Provider初始化(2.2.0 新增 ) -> 'created'的回调 -> 渲染初始化( $mount )。
  };

}

Vue$3.prototype.$mount = function (el,hydrating) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};



当使用 new Vue() 创建实例的时候会调用 Vue._init -> initState (vm),状态( $data,$props )管理 ( 主要使用Object.defineProperty ) 的构建，事件监听管理 ( $on,$once,$off,$emit ) 的构建，生命周期(beforeUpdate,beforeDestroy,destroyed)的构建，渲染方法的构建(_render 和 $nextTick)


function initState (vm) {
  vm._watchers = []; //_watchers 用来存放vm 上所有的wathcer
  var opts = vm.$options;
  if (opts.props) {
    initProps(vm, opts.props); //初始化props，与initData 类似,多加了数据验证validateProp
  }
  if (opts.methods) {
    initMethods(vm, opts.methods);
    //初始化methods,遍历methods 指定到vm实例上，并且绑定
    //vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
  if (opts.data) {
    initData(vm);// 初始化data, 他会调用 observe(data)，observe完成依赖收集
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) {
    initComputed(vm, opts.computed); //初始化 computed
  }
  if (opts.watch) {
    initWatch(vm, opts.watch); //初始化watch
  }

}


    //initComputed 会为每个计算属性实例化一个 Wacther，并挂载到vm实例上
function initComputed (vm, computed) {
  var watchers = vm._computedWatchers = Object.create(null);
  for (var key in computed) {
    var userDef = computed[key];

    // 方法被设置Wie一个getter ，作为参数传入Wacther
    var getter = typeof userDef === 'function' ? userDef : userDef.get;
    {
      if (getter === undefined) {
        warn(
          ("No getter function has been defined for computed property \"" + key + "\"."),
          vm
        );
        getter = noop;
      }
    }
    // create internal watcher for the computed property.
    watchers[key] = new Watcher(vm, getter, noop, computedWatcherOptions);
    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) { //如果没有绑定则会新创建一个
      defineComputed(vm, key, userDef);
    } else {
      if (key in vm.$data) {
        warn(("The computed property \"" + key + "\" is already defined in data."), vm);
      } else if (vm.$options.props && key in vm.$options.props) {
        warn(("The computed property \"" + key + "\" is already defined as a prop."), vm);
      }
    }
  }
}
function defineComputed (target, key, userDef) {
  if (typeof userDef === 'function') {//
    sharedPropertyDefinition.get = createComputedGetter(key);
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get? userDef.cache !== false? createComputedGetter(key) : userDef.get: noop;
    sharedPropertyDefinition.set = userDef.set ? userDef.set: noop;
  }
// userDef 函数作为计算方法，会被挂载到 key 的 get方法上，当获取key的时候就会执行该函数进行计算,并返回一个计算结果
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {

       //评估是否需要重新计算,evaluate 会 get key ，把 value 赋值给 watcher.value
      if (watcher.dirty) {
        watcher.evaluate();
      }

       // 依赖收集
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

// initWatch的过程中其实就是实例化new Watcher完成观察者的依赖收集的过程，在内部的实现当中是调用了原型上的Vue.prototype.$watch方法。这个方法也适用于vm实例，即在vm实例内部调用this.$watch方法去实例化watcher，完成依赖的收集，同时监听expOrFn的变化。n的变化。
initWatch -> createWatcher -> vm.$watch -> new Watcher


2、实现： 会传入指令的 expression。Watcher 构造函数会对传入的expression 进行一些处理，如果是函数则直接设置为Watcher的 getter 方法。 对象或数组则通过 parsePath (expOrFn) 方法对 expression 做进一步的解析，parsePath  会返回一个函数。

//2691 行
var Watcher = function Watcher (vm,expOrFn,cb,options) {
  this.vm = vm;
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$2; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = expOrFn.toString();
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
      //...........
    }
  }
  this.value = this.lazy? undefined: this.get();
}





//get  的功能就是对当前 Watcher 进行求值，收集依赖关系
Watcher.prototype.get = function get () {
//设置当前要执行的watcher
pushTarget(this);
  var value;
  var vm = this.vm;
  if (this.user) {
    try {
      value = this.getter.call(vm, vm);// this.getter 触发了当前target的gettter函数
    } catch (e) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    }
  } else {

    // 如果是新建模板函数，则会动态计算模板与data中绑定的变量，这个时候就调用了getter函数，那么就完成了dep的收集
// 调用getter函数，则同时会调用函数内部的getter的函数，进行dep收集工作
    value = this.getter.call(vm, vm);
  }
  // "touch" every property so they are all tracked as dependencies for deep watching

  // 每一个属性都被跟踪为依赖，深入观察
  if (this.deep) {
    traverse(value);
  }
  popTarget();
  this.cleanupDeps();
  return value
}


//当我们取值的时候(this.key),会触发key的get方法，进而调用到 dep.depend() (看：Observer defineReactive$$1 的实现) depend 会对当前 Dep.target 收集依赖, dep.depend() 又调用了 Dep.target.addDep() 方法 ，(Dep.target 就是当前正在被计算的watcher实例),相当于调用了 Watcher 实例的 addDep 方法
// 把 dep 添加到 Watcher 实例的依赖中，同时又通过 dep.addSub(this) 把 Watcher 实例添加到 dep 的订阅者中
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }

};

// 修改key的时候则会调用watcher 实例的set 方法，进而调用 setter 方法，observe 方法完成新的依赖收集，并调用
dep.notify() ，他会遍历所有该watcher 实例的订阅者，并调用订阅者的 update 函数进行更新操作
//至此，指令完成了依赖收集，并且通过 Watcher 完成了对数据变化的订阅。

Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;

};



三、Observer 观察者

1、初始化 (initData)



//3005 行
function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) { //对data数据进行判断是否是纯对象 toString.call(data) === '[object Object]'
    data = {};
    "development" !== 'production' && warn(
      'data functions should return an object:\n' +
      'https://vuejs.org/v2/guide/components.html#data-Must-Be-a-Function',
      vm
    );
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var i = keys.length;
  while (i--) {
    if (props && hasOwn(props, keys[i])) {
      "development" !== 'production' && warn(
        "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
        "Use prop default value instead.",
        vm
      );
    } else if (!isReserved(keys[i])) {
      proxy(vm, "_data", keys[i]);//proxy 把data的每个key 代理到 vm 上 访问 vm.key 就等于 vm.data.key
    }
  }
  // observe data
  observe(data, true /* asRootData */);//把 data.key 转换为可观察对象,而不是整个data
}



2、代理 proxy



//initProxy 会检测是否定义了Proxy 方法，有则调用Proxy 把 handlers 代理到vm上(与data一样 访问vm.handler
//就等于访问 vm.methods.hanlder)。没有则把vm 赋值给vm._renderProxy

//1609 行
var initProxy = function initProxy (vm) {
    if (hasProxy) {
      // determine which proxy handler to use
      var options = vm.$options;
      var handlers = options.render && options.render._withStripped
        ? getHandler
        : hasHandler;
      vm._renderProxy = new Proxy(vm, handlers);
    } else {
      vm._renderProxy = vm;
    }

  };
var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,//默认空函数
  set: noop,//默认空函数
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };


  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };


  Object.defineProperty(target, key, sharedPropertyDefinition);
}



3、Observer


//887 行
function observe (value, asRootData) {
  if (!isObject(value)) {
    return
  }
  var ob;

    //先判断 value(前面传进来的data.key) 是否添加了ob属性,已添加则说明这是一个可观察对象，直接使用。不是则在value 满足（ 数组或对象、可扩展、非 vue 组件等条件）新创建一个ob对象实例
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    observerState.shouldConvert &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}
//821 行

var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();//Dep 是什么，详见第4
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

//walk 方法 对obj 进行遍历
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive$$1(obj, keys[i], obj[keys[i]]);
  }
};

//observeArray 对是数组的 key进行遍历并调用 abserve 方法(多维数组会形成递归 abserve -> Observer -> observeArray ),最终会进入walk方法

//912 行
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }

};

//对每个key赋予set 和get 方法,Object.defineProperty 监听对象属性的设置和获取操作，并返回计算处理后的值
//912 行
function defineReactive$$1 (obj,key,val,customSetter) {
  var dep = new Dep();
  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }
  // cater for pre-defined getter/setters
  var getter = property && property.get;
  var setter = property && property.set;
  var childOb = observe(val);//对于当前target 下的key 用同样的方式创建可观察对象
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
        }
        if (Array.isArray(value)) {
          dependArray(value);
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if ("development" !== 'production' && customSetter) {
        customSetter();
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = observe(newVal);
      dep.notify();
    }
  });

}



4、Dep
//Dep 是用来存储所有订阅者(watcher)的对象,Dep.target 表示当前正在计算的 Watcher，它是全局唯一的，因为在同一时间只能有一个 Watcher 被计算
//708 行
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

//添加订阅者
Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};


//移除订阅者

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};


//通过 Dep.target.addDep(this) 方法把当前 Dep 的实例添加到当前正在计算的Watcher 的依赖中

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);//详见 Watcher.prototype.addDep
  }
};

//notify 会遍历所有的订阅者并依次调用他们的update方法
Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
}
````
