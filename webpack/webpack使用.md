# webpack Tree-shaking 原理

# Electron 通讯，主进程与渲染进程的通讯

# webpack 怎么与 CDN 结合使用

# webpack Loader 和 plugin 的区别，分别在 webpack 的什么时间执行

## loader 的作用

### 把源模块转换成通用模块

### Loader 用于对源码的转换，它描述了 webpack 如何处理非 js 模块，并且在 build 中引入这些依赖。loader 可以将其他东西转换成 JavaScript 语言。在 config 中的 module.rules 中配置，可使用 option 参数进行配置

## loader 的执行顺序(Webpack 选择了 compose 方式，即从右到左执行 loader)

### loader 是从右往左进行解析执行的，最后一个执行的时候拿到 source 的内容，中间的 loader 被链式地调用，他们拿到上一个 loader 的返回值，为下一个 loader 提供输入，顺序第一的 loader 执行后会返回 js 代码和 sourcemap，最终交给 webpack

```
{
    test: /\.js/,
    use: [
        'bar-loader',
        'mid-loader',
        'foo-loader'
    ]
}
//执行顺序是： foo-loader -> mid-loader -> bar-loader
```

### loader 的特点

#### 单一职责：单个 loader 只做一件事，不仅可以使维护简单，还能使其互相串联组合，处理复杂场景需求

#### 链式组合：处理复杂需求时，需要将多个 loader 组合在一起

#### 模块化：保证 loader 是模块化的并遵循模块化设计原则

#### 无状态：不应该在 loader 中保留状态，每个 loader 都应与其他 loader 编译好的模块保持独立

### 编写 loader 注意事项

#### 依赖外部资源，必须先声明这些资源

#### 模块依赖

1、把不同的依赖声明同意转化为 require 声明  
2、通过 this.resolve 函数来解析路径

#### 代码公用：避免在多个 loader 里面初始化同样的代码，把这些公共代码提取到一个运行时文件，通过 require 来引入到 loader 中

#### 不要在 loader 里面使用绝对路径，路径变化后悔影响 webpack 的 hash 计算

## plugin 可以为 loader 带来更多特性，目的在于结局 loader 不能解决的事情，从打包优化、压缩、环境变量等等

### 比如：webpack3 中 commonChunkPlugin 用于提取第三方库和公共模块。

````
    new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor','runtime'],
        filename: '[name].js',
        chunks: ['vendor']
    });
```
#### 在webpack4中 使用 optimization 进行配置splitChunks

```
configureWebpack: {
    optimization: {
      splitChunks: {
        minChunks: 2,
        minSize: 20000,
        maxAsyncRequests: 20,
        maxInitialRequests: 30,
        name: false
      }
    }
}
````
