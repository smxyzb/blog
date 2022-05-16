# 根组件实例 创建方式  createRoot
## 以前
```
import ReactDom from 'react-dom'
import App from './App'
const container = document.getElementById('root')
ReactDom.render(<App/>,container)

```
## 新变化通过 createRoot 创建一个root，通过root.render 创建实例
```
import {createRoot} from 'react-dom/client'
import App from './App'
const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App/>)
```

# 自动批量更新（Automatic Batching）

```
setTimeout(()=>{
  setCount(c=>c+1)
  setFlag(f=>!f)
})
```
## 以上代码在18版本以前会触发两次更新。新版本只会出发一次批量更新，包括setTimeout,Promise 等

## flushSync 处理单独更新
```
setTimeout(()=>{
  setCount(c=>c+1)
})

flushSync(()=>{
  setFlag(f=>!f)
})
```

# 并发渲染模式 (Concurrent)：以前的更新是一个线性的，一个接一个的，并且不能中断的，新版本有以下变化
## 渲染可中断、继续、终止
## 渲染可在后台进行
## 渲染可以有优先级
## 他是一个新的底层机制，并不是一个性功能

### 开发者可以决定渲染的优先级

# 建立在Concurrent 上的Transitions ,用来控制渲染优先级
## 非 hooks 模式下使用 startTransition  
```
import {startTransition} from 'react'
startTransition(()=>{
  setFlag(c=>!c)
})

```
## hooks 模式下使用 useTransiton
```
import {useTransiton} from 'react'
const [isPending,startTransiton] = useTransiton()
// isPending 该次优先级的渲染是否在等待中
```
## 可以使用以上两个API 把更新操作包裹起来，达到控制低优先级的效果，常见场景如：输入框及时搜索（输入和结果列表优先级的控制）


# fetch data on/then  render 的优化 Suspense 组件，与Vue3 机制类型
```
<Suspense fallback={<div>加载中...</div>}>
  <Component>
</Suspense>
```
