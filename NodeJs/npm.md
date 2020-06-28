# NPM

## package.json

### bin：指定了各个内部命令对应的可执行文件的位置

```
"bin": {
    "vm2": "./bin/vm2"
  }
```

### main：指定程序的入口文件，其他项目在引用这个包的时候，引用的是/lib/index 中暴露的模块

### scripts：定义各种脚本命令

```
"scripts": {
  "test": "test.js"
  "build": "tsc",
},
```
