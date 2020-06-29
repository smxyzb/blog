# webpack

## bable-loader 作用和原理

### 作用：语法转换

### 配置 .babellrc

```
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    "syntax-dynamic-import"
  ]
}
```

## webpack 优化

### cache（缓存）

#### babel 缓存 cacheDirectory

```
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: [],
          // 开启 babel 缓存
          // 第二次构建时，会读取之前的缓存
          cacheDirectory: true
        }
      }
    ]
```

#### 文件资源缓存：hash ，chunkhash(根据春款生成 hash)， contenthash(根据内容生成 hash)

### alias 别名路径

```
resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  }
```

### 自带优化 tree-shaking 默认只在生成环境下生效，并且只支持 es6 import 语法

#### 原理：基于 es6 module 的几个特性

-   只能作为模块顶层的语句出现

-   import 的模块名只能是字符串常量

-   import binding 是 immutable（一成不变）的

<strong>基于以上三个特点，ES6 模块依赖关系是确定的，和运行时的状态无关，可以进行可靠的静态分析，这就是 tree-shaking 的基础。就可以在不执行代码的情况下，对代码进行静态分析。静态分析就是不执行代码，从字面量上对代码进行分析，找到使用或者未使用的模块，属性方法等。</strong>

-   这些工作就是由代码压缩优化工具 uglify 来完成的

<strong>但是：tree-shaking 不能对类进行消除，因为类内部可能会对一些通用方法属性的改写，一旦消除，就没法执行，这样在其他地方使用的时候就会出现问题</strong>

### module ：noParse ，不通过 webpack 解析某些模块

```
module: {
    noParse: /jquery/, // 优化不对jquery做解析
    rules: []
}
```

### rules 的 include ,exclude 包含与排除某些目录

```
{
    test: /\.js$/,
    exclude:'node_modules',
    include:path.resolve('src'),
}
```

### ignorePlugin ：忽略部分插件模块

```
new webpack.IgnorePlugin(/\.\/locale/,'moment') // 忽略moment 模块下面的locale 模块
```

### HappyPack 多线程打包,适用于项目较大的打包

```
let Happypack = require('happypack')
module:{
  rules:[
    {
          test: /\.js$/,
          exclude:'node_modules',
          include:path.resolve('src'),
          use: "Happypack/loader?id="js"
    }
  ]
},
plugins:[
  new Happypack({
    id:'js',
    use[{
      loader:'bable-loader',
      options:{

      }
    }]
  })
]
```

### externals ，在 html 直接 script 引入插件

```
    externals : {
       react: 'react',
       redux: 'redux'
    }
```

### dllPlugin 模块动态链接库

```
const path = require('path')
const webpack = require('webpack')
// dll文件存放的目录
const dllPath = 'public/vendor'

module.exports = {
  entry: {
    // 需要提取的库文件
    vendor: ['vue', 'vue-router', 'vuex', 'axios', 'element-ui']
  },
  output: {
    path: path.join(__dirname, dllPath),
    filename: '[name].dll.js',
    // vendor.dll.js中暴露出的全局变量名
    // 保持与 webpack.DllPlugin 中名称一致
    library: '[name]_[hash]'
  },
  plugins: [
    // manifest.json 描述动态链接库包含了哪些内容
    new webpack.DllPlugin({
      path: path.join(__dirname, dllPath, '[name]-manifest.json'),
      // 保持与 output.library 中名称一致
      name: '[name]_[hash]',
      context: process.cwd()
    })
  ]
}
```

### 抽离公共代码

```
optimization: { // 老名称commonChunkSplit
    splitChunks: { //代码分割
      cacheGroups: { // 缓存组
        common: { //公共的模块
          chunks: 'initial',
          minSize: 0,
          minChunks: 2 //最小引用次数
        },
        // 第三方插件的抽离
        vendor: {
          priority: 1, //权重优先
          test: /node_modules/,
          chunks: 'initial',
          minSize: 0,
          minChunks: 2
        }
      }
    }
  }
```

### 懒加载 (vue,react 的懒加载)

原理：jsonp 的形式获取资源

```
document.addEventlistener('click',function(){
  // es6 草案中的语法，jsonp 实现动态加载文件
  // 返回的是一个Promise，并且会把加载结果赋值给default属性
  import('./source.js).then(data=>{
    console.log(data.default)
  })
})
```

### 热更新（不是刷新）

```
plugins:[
  new webpack.NamedModulesPlugin(),// 打印更新的模块路径
  new webpack.HotModuleReplacementPlugin()
]

// 配合使用
import str from './source.js'
console.log(str);
if (module.hot) {
  module.hot.accept('./source.js', () => {
    console.log('文件更新了');
    require('./source.js')
  })
}
```
