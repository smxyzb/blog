#### 合并顺序权重

1、组件选项 2、组件 - mixin 3、组件 - mixin - mixin 4、…省略无数可能存在的嵌套 mixin x、全局 选项

#### 组件的合并

### 函数方法属性合并叠加：

## 相同的方法将会被合并成一个新函数方法中，并且返回这个新函数，在函数里面，会执行这两个方法

## data 中有重复的，权重大的优先，以组件本身的为主，因为组件本身权重大

## 数组叠加

生命周期函数，权重大的放后面，会被合并成一个数组，比如 created

```
[
    全局 mixin - created，
    组件 mixin-mixin - created，
    组件 mixin - created，
    组件 options - created
]

```

生命周期，权重小的先执行

## watch 合并后权重大越大越放后面

```
[
    全局 mixin - watch，
    组件 mixin-mixin - watch，
    组件 mixin - watch，
    组件 options - watch
]
```
执行流程是，权重小的先执行

### 原型叠加 ：包括选项 components，filters，directives
## 两个对象合并的时候，不会相互覆盖，而是 权重小的 被放到 权重大 的 的原型上，这样权重大的，访问快些，因为作用域链短了

###  覆盖叠加：包括选项 props，methods，computed，inject
## 两个对象合并，如果有重复的key ，权重大的覆盖权重小的，比如props ，name 属性会以组件的为主

### 直接替换：这是默认的处理方式，当选项不属于上面的处理方式的时候，就会像这样处理，包含选项：el，template，propData 等。两个数据只替换，不合并，权重大的，会一直替换 权重小的，因为这些属于只允许存在一个，所有只使用权重大的选项，组件 设置 template，mixin 也设置 template，组件的肯定优先

#### mixins 合并

### data 数据：挂载到组件实例的原型**proto**上，同时 mixin 的原型上也有对组件实例的 data 数据引用
