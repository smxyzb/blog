# Keep-live 实现原理

```
// src/core/components/keep-alive.js
function pruneCacheEntry (
  cache: VNodeCache,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
 const cached = cache[key]
 if (cached && (!current || cached.tag !== current.tag)) {
    // 执行组件的destroy钩子函数
    cached.componentInstance.$destroyed()
 }
 cache[key] = null
 remove(keys, key)
}

export default {
  name: 'keep-alive',
  abstract: true,
  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },
  created () {
    this.cache = Object.create(null)
    this.keys = []
  },
  destroyed () {
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys)
    }
  },
  mounted () {
    // 监听白名单黑名单的变化
    this.$watch('include', val => {
      pruneCache(this, name => matches(val, name))
    })
    this.$watch('exclude', val => {
      pruneCache(this, name => !matches(val, name))
    })
  },
  render () {
    const slot = this.$slots.default
    // 获取keeplive 组件下的第一个子组件
    const vnode: VNode = getFirstComponentChild(slot)
    const componentOptions: ?VNodeComponentOptions = vnode && vnode.componentOptions
    if (componentOptions) {
      // check pattern
      const name: ?string = getComponentName(componentOptions)
      const { include, exclude } = this
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }
      const { cache, keys } = this
      // 生成缓存key，并缓存起来
      const key: ?string = vnode.key == null
        ? componentOptions.Ctor.cid + (componentOptions.tag ? `::${componentOptions.tag}` : '')
        : vnode.key
      if (cache[key]) {
        // 给vnode 的componentInstance 赋值为当前缓存组件实例，在 pacth 的createComponent使用到
        vnode.componentInstance = cache[key].componentInstance
        // 已缓存过的组件，调整当前组件的缓存顺序保证当前组件时最新的
        remove(keys, key)
        keys.push(key)
      } else {
        // 添加缓存
        cache[key] = vnode
        keys.push(key)
        // 超出最大缓存限制则删除缓存的第一个组件
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode)
        }
      }

      vnode.data.keepAlive = true
    }
    return vnode || (slot && slot[0])
}

// src/core/instance/lifecycle.js
// 在初始化的时候会执行initLifeStyle 方法
export function initLifecycle (vm: Component) {
    const options= vm.$options
    // 查找第一个 不是抽象组件的组件作为父组件
    let parent = options.parent
    if (parent && !options.abstract) {
        while (parent.$options.abstract && parent.$parent) {
              parent = parent.$parent
        }
        parent.$children.push(vm)
    }
    vm.$parent = parent
}

// src/core/vdom/patch.js
function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    let i = vnode.data
    if (isDef(i)) {
        // 第一次使用组件的时候vnode.componentInstance为undefined
        const isReactivated = isDef(vnode.componentInstance) && i.keepAlive
        if (isDef(i = i.hook) && isDef(i = i.init)) {
            i(vnode, false)
        }
        // 如果vnode.componentInstance存在
        if (isDef(vnode.componentInstance)) {
            initComponent(vnode, insertedVnodeQueue)
            // 将缓存的vnode.elem 插入到父元素中
            insert(parentElem, vnode.elem, refElem)
            if (isTrue(isReactivated)) {
                reactivateComponent(vnode, insertedVnodeQueue, parentEle, refElm)
            }
            return true
        }
    }
}

// insert 方法
const componentVNodeHooks = {
      // init()
     insert (vnode: MountedComponentVNode) {
           const { context, componentInstance } = vnode
           if (!componentInstance._isMounted) {
                 componentInstance._isMounted = true
                 callHook(componentInstance, 'mounted')
           }
           if (vnode.data.keepAlive) {
                 if (context._isMounted) {
                     queueActivatedComponent(componentInstance)
                 } else {
                      activateChildComponent(componentInstance, true/* direct */)
                 }
          }
         // ...
     }
}

// 子组件的activated 处理
// src/core/instance/lifecycle.js
export function activateChildComponent (vm: Component, direct?: boolean) {
  if (direct) {
    vm._directInactive = false
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false
    for (let i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i])
    }
    callHook(vm, 'activated')
  }
}
```
