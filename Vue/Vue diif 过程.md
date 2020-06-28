# diif

## 当数据变化时，set 方法会调用 Dep.notify() 通知所有订阅者 Watcher，Watcher 就会调用 patch 给 DOM 打补丁

## 比较方式：才要新旧 DOM 同层比较，不会跨级比较

```
function sameVnode (a, b) {
  return (
    a.key === b.key &&  // key值
    a.tag === b.tag &&  // 标签名
    a.isComment === b.isComment &&  // 是否为注释节点
    // 是否都定义了data，data包含一些具体信息，例如onclick , style
    isDef(a.data) === isDef(b.data) &&
    sameInputType(a, b) // 当标签是<input>的时候，type必须相同
  )
}

function patch (oldVnode, vnode) {
    // 同一节点则直接进行比较
    if (sameVnode(oldVnode, vnode)) {
        patchVnode(oldVnode, vnode)
    } else {
        const oEl = oldVnode.el // 当前oldVnode对应的真实元素节点
        let parentEle = api.parentNode(oEl)  // 父元素
        createEle(vnode)  // 根据Vnode生成新元素
        if (parentEle !== null) {
            api.insertBefore(parentEle, vnode.el, api.nextSibling(oEl)) // 将新元素添加进父元素
            api.removeChild(parentEle, oldVnode.el)  // 移除以前的旧元素节点
            oldVnode = null
        }
    }
    // some code
    return vnode
}
```

### 首先会判断两个节点是否值得比较，是同一节点才会进行比较 (patchVnode),不是同一节点则插入新的节点,移除旧的节点

```
patchVnode (oldVnode, vnode) {
    const el = vnode.el = oldVnode.el
    let i, oldCh = oldVnode.children, ch = vnode.children
    if (oldVnode === vnode) return
    if (oldVnode.text !== null && vnode.text !== null && oldVnode.text !== vnode.text) {
        api.setTextContent(el, vnode.text)
    }else {
        updateEle(el, vnode, oldVnode)
        if (oldCh && ch && oldCh !== ch) {
            updateChildren(el, oldCh, ch)
        }else if (ch){
            createEle(vnode) //create el's children dom
        }else if (oldCh){
            api.removeChildren(el)
        }
    }
}
```

#### 主要做了几件事

#### 如果新旧节点都有文本节点，并且不相等，那么将 el 的文本设置为新 Vnode 的文本节点

#### 如果 oldVnode 没有子节点而 Vnode 有子节点，则创建 Vnode 的子节点,添加到 el

#### 如果 oldVnode 有子节点而 Vnode 没有子节点，则删除 el 的子节点

#### 如果两者都有子节点，则需要进行 updateChildren 比较子节点

### updateChildren

```
updateChildren (parentElm, oldCh, newCh) {
    let oldStartIdx = 0, newStartIdx = 0
    let oldEndIdx = oldCh.length - 1
    let oldStartVnode = oldCh[0]
    let oldEndVnode = oldCh[oldEndIdx]
    let newEndIdx = newCh.length - 1
    let newStartVnode = newCh[0]
    let newEndVnode = newCh[newEndIdx]
    let oldKeyToIdx
    let idxInOld
    let elmToMove
    let before
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        // 对于vnode.key的比较，会把oldVnode = null
        if (oldStartVnode == null) {
            oldStartVnode = oldCh[++oldStartIdx]
        }else if (oldEndVnode == null) {
            oldEndVnode = oldCh[--oldEndIdx]
        }else if (newStartVnode == null) {
            newStartVnode = newCh[++newStartIdx]
        }else if (newEndVnode == null) {
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldStartVnode, newStartVnode)) {
            patchVnode(oldStartVnode, newStartVnode)
            oldStartVnode = oldCh[++oldStartIdx]
            newStartVnode = newCh[++newStartIdx]
        }else if (sameVnode(oldEndVnode, newEndVnode)) {
            patchVnode(oldEndVnode, newEndVnode)
            oldEndVnode = oldCh[--oldEndIdx]
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldStartVnode, newEndVnode)) {
            patchVnode(oldStartVnode, newEndVnode)
            api.insertBefore(parentElm, oldStartVnode.el, api.nextSibling(oldEndVnode.el))
            oldStartVnode = oldCh[++oldStartIdx]
            newEndVnode = newCh[--newEndIdx]
        }else if (sameVnode(oldEndVnode, newStartVnode)) {
            patchVnode(oldEndVnode, newStartVnode)
            api.insertBefore(parentElm, oldEndVnode.el, oldStartVnode.el)
            oldEndVnode = oldCh[--oldEndIdx]
            newStartVnode = newCh[++newStartIdx]
        }else {
           // 使用key时的比较
            if (oldKeyToIdx === undefined) {
                oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx) // 有key生成index表
            }
            idxInOld = oldKeyToIdx[newStartVnode.key]
            if (!idxInOld) {
                api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                newStartVnode = newCh[++newStartIdx]
            }
            else {
                elmToMove = oldCh[idxInOld]
                if (elmToMove.sel !== newStartVnode.sel) {
                    api.insertBefore(parentElm, createEle(newStartVnode).el, oldStartVnode.el)
                }else {
                    patchVnode(elmToMove, newStartVnode)
                    oldCh[idxInOld] = null
                    api.insertBefore(parentElm, elmToMove.el, oldStartVnode.el)
                }
                newStartVnode = newCh[++newStartIdx]
            }
        }
    }
    if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].el
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx)
    }else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx)
    }
}
```

#### updateChildren 主要做了几件事情:

1、将 Vnode 的子节点 VCh 和 oldVnode 的子节点 oldCh 提取出来  
2、设置 VCH 和 oldCh 的 StartIndex 和 EndIndex，然后根据各自的 StartIn 得下和 EndIndex 取对应的子节点进行比较，进行总共 4 种比较。看是不是同一个节点  
3、如果 4 种比较都没匹配的情况下，如果设置了 key，则会使用 key 进行比较，通过 oldKeyToIdx 利用 key 创建一个映射关系，使用 key 查找节点进行比较  
4、整个比较过程中 StartIndex 和 EndIndex 会往中间靠（StartIndex 增，EndIndex 减），当出现 StartIndex > EndIndex 的时候，就说嘛 vCH 和 oldCh 至少有一个已经比那里玩了，就会结束比较  
5、oldVnode 遍历完，有可能 Vnode 没完，得把当前新的节点添加进去;Vnode 遍历完，说明新节点在原来基础上有删减，则移除当前遍历到的旧节点

### 不是同一节点则先取到父节点，创建新节点并插入父节点中，移除以前的节点
