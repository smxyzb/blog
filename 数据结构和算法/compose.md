# 实现一个 compose

```
export default function compose(...funcs) {
  //如果没有传入function,则返回一个空方法，该方法只是将接收到的参数直接返回
  if (funcs.length === 0) {
    return arg => arg
  }

  //如果只有一个方法，则直接返回该方法
  if (funcs.length === 1) {
    return funcs[0]
  }

  //取出最后一个方法作为初始化方法
  const last = funcs[funcs.length - 1]
  //取出除最后一个方法外的其余方法用于遍历
  const rest = funcs.slice(0, -1)
  //从右到左合并funcs方法
  //将方法的参数，作为最后一个方法的参数，这个方法的返回值，作为下一个方法的入参
  return (...args) => rest.reduceRight((composed, f) => f(composed), last(...args))
}
```
