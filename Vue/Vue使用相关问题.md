## 怎么理解 Vue 的渐进式

## Vue mergeOption 规则

## Vue 数组改变不重写方法

## diff 过程

## Vue-router 组件有那几个

## mixins 嵌套原理，Vuex Module 嵌套，extends

## Observer Compiler Wacther 的作用

## BeforeROuterEnter ，BeforeRouterLeave，参数，router 导航方法，跳转方式

## 组件多，页面卡顿的优化

## Vue 依赖收集过程，原理

## Vue 列表位置缓存，列表到详情再返回怎么保证停留在原来的位置

### keep-alive 组件，使组件缓存起来，不被销毁

### scrollBehavior

```
new vueRouter({
    mode:'hash',
    scrollBehavior(to, from, savedPosition)=> {
      if (savedPosition) {
        return savedPosition
      } else {
        return { x: 0, y: 0 }
      }
      if (to.hash) {
        return {
          selector: to.hash
        }
      }
    }
})
```

#### 如果需要在不同组件中定制不同的滚动行为，需要在 route 的 meta 属性里面存储具体位置信息，然后在 scrollBehavior 中使用返回 to.meta 即可

### 控制滚动

```
window.scrollTo(0, 1);
```

## keep-alive 是干什么的

### keep-alive 是一个抽象组件,name 值为 keep-alive，它自身不会渲染一个 DOM 元素，也不会出现在父组件链中；

### 使用 keep-alive 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们

### 原理 见 Keeplive.md

### <strong> 注意</strong>

#### 缓存的组件在下一次进入的时候 mounted 以及之前的生命周期都不会被触发

#### 缓存的组件会有一个 activated 和 deactiveted 生命周期，分别在下一次进入和离开的时候会触发，不会触发 beforDestory 和 distoryed

## Vue Core 模块主要关注什么，主要任务

## v-model 的实现，sync 的实现原理，如何使用他们来封装组件

## created ，beforeUpdated 里面更改数据会出发 update 吗

## Vue mounted 循环为什么不会一直更新
