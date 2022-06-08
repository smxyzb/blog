# npm install 
## install 的时候会在node_modules里面生成一个.bin 目录，并且在这个目录生成所需要的模块的 软连接（就像windows 里面的快捷方式） 比如 vite，它指向对应的实体模块 node_modules/vite
## 软连接内容为 顶部 #!/bin/sh 表示这是一个脚本，下面是对应模块的入口文件（node_modules/vite/bin/vite.js）代码

# 执行 npm run xxx
## 当我们执行 npm run vite 的时候 就会执行 node_modules/vite/bin/vite.js。
### 首先是 在项目根目录查找package.json script 中的命令 vite
### npm 根据 vite 在 node_modules/.bin 目录下面查找对应的 vite 软连接。如果项目目录没找到，则会查找全局的（即我们npm install -g 的时候安装的全局模块脚本）
### 执行脚本，由于该软连接指向了node_modules/vite 模块，所以会来到 node_modeuls/vite 目录。
### 通过模块中的 package.json 配置中的 bin 字段，该字段的值 bin/vite.js 就只最终要执行的模块文件。 
```
  "bin": {
    "vite": "bin/vite.js"
  }
```
