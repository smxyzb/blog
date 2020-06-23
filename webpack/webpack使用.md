## webpack Tree-shaking 原理

## Electron 通讯，主进程与渲染进程的通讯

## webpack 怎么与 CDN 结合使用

## webpack Loader 和 plugin 的区别，分别在 webpack 的什么时间执行

### Loader 用于对源码的转换，它描述了 webpack 如何处理非 js 模块，并且在 build 中引入这些依赖。loader 可以将其他东西转换成 JavaScript 语言。在 config 中的 module.rules 中配置，可使用 option 参数进行配置

### plugin 可以为 loader 带来更多特性，目的在于结局 loader 不能解决的事情，从打包优化、压缩、环境变量等等

#### 比如：webpack3 中 commonChunkPlugin 用于提取第三方库和公共模块。

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