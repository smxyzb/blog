# Block Tree
## Block Tree 是什么？<strong><a href='https://zhuanlan.zhihu.com/p/108844288'>About Vue3 Block Tree</a></strong>

## 静态提升，DOM Diff 优化：利用Block Tree 的概念，保持Dom tree 的稳定性，精简DOM Diff的比较范围，提升DOM Diff的性能。
### Vue2中的DOM Diff，是一个相对耗时的操作，因为它需要对比两个虚拟DOM树的所有节点，而且是递归的，时间复杂度是O(n^3)，虽然在编译过程中已经座机静态标记，但是在运行时，还是需要对比所有的节点，这样的性能开销是非常大的。

#### <strong>假如有个child节点用了v-if指令，某个条件下生成或删除了某些节点，那么整个dom树会发生较大的变化</strong>，比如顺序，此时需要进行大量的VNode节点的移动等操作

### Vue3 中的DOM Diff，是基于Block Tree的概念，专注于动态变化的DOM节点，使用替换占位的形式最大限度减少children 节点的变化，如果一个节点被移除了，那么在VNode中它会被替换成一个占位注释。例如
```
<!--v-if-->

```
### 这保证了同层级的VNode顺序不会发生改变，只需对比动态变化的节点即可，比如 使用了 v-if 指令的节点。在Vue3项目的dom结构中以上注释是比较常见的

#### 举个例子，假设有如下的DOM结构：
#### 代码块来自文章 <strong><a href='https://zhuanlan.zhihu.com/p/108844288'>About Vue3 Block Tree</a></strong>
```
<div>
    <div v-if="aa" id="foo">
        <p>{{ hello }}</p>
    </div>
</div>
```
#### 在Vue3中，生成的render function是这样的：
```
return (_openBlock(), _createBlock("div", null, [
    (_ctx.aa)
      ? (_openBlock(), _createBlock("div", _hoisted_1, [
          _createVNode("p", null, _toDisplayString(_ctx.hello), 1 /* TEXT */)
        ]))
      : _createCommentVNode("v-if", true) // 占位注释
  ]))
```
#### 当进行patch 的时候，只需要专注于 条件位aa的变化，和 插入式的 hello 变化，而不需要对比整个DOM树，这样就大大减少了DOM Diff的比较范围，提升了DOM Diff的性能。
```
const patchElement = (
    n1: HostVNode,
    n2: HostVNode,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: HostSuspenseBoundary | null,
    isSVG: boolean,
    optimized: boolean
  ) => {
      // ...
      // 有动态子节点，进行动态子节点的patch
      if (dynamicChildren != null) {
      patchBlockChildren(
        n1.dynamicChildren!,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        areChildrenSVG
      )
    } else if (!optimized) {
      // full diff
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        areChildrenSVG
      )
    }
    //...
  }
```
