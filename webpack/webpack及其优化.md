#### webpack 优化

### 自带优化 treeshaking 默认只在生成环境下生效，并且只支持 es6 import 语法

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