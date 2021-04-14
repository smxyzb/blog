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

### scripts 原理：每次在运行 script 命令的时候，系统会自动新建一个 shell(一般是 bash，在这个 shell 里面执行指定的脚本命令，因此，凡是能在 shell 中运行的脚本，都可以写在 NPM script 中

#### <strong>npm run shell commond 会在当前目录的 node_modules/.bin 目录创建 commond ，并且将该路径加入到 PATH 变量,执行结束后，再将 PATH 变量恢复原样</strong>

```
"test": "./node_modules/.bin/test"
```

-   如果安装的某个模块配置，则会在安装时软连接到 node_modules/.bin 下面

### 默认脚本 start 和 install：npm 本身对两个脚本提供了默认值，这两个脚本不用在 script 属性中定义，可以直接使用

```
"start": "node server.js"
"install": "node-gyp rebuild"
```

### 钩子（生命周期）pre 和 post

-   例如 npm run build 的时候

```
npm run prebuild && npm run build && npm run postbuild
```

-   作用：可以在开发中做一些准备工作，比如环境变量设置，打包清理等

*   如果配置了 pre 命令，则会限制性该 pre 命令。<strong>注意：这里如果在 prebuild 里面设置环境变量，在 build 里面是拿不到的，因为运行的是不同的 shell</strong>

```
"prebuild": "node test",
"build": "webpack",
```

## 环境变量 env

### npm run 的时候，会将 package.json 的全部字段设置为 npm*package* 开头的环境变量

-   比如 npm_package_name、npm_package_version、npm_package_script_build、npm_package_files_0 等

## 参数： process.argv 可以拿到命令传入的参数

```
"scripts":{
  "serve": "vue-cli-service serve --mode=dev --mobile -config build/example.js"
}
```

## 任务的执行

### 并行任务是要 & 符号连接

```
npm run script1.js & npm run script2.js
```

### 串行任务是要 && 符号连接

```
npm run script1.js && npm run script2.js
```

## npm 配置

### .npmrc 文件，可以通过修改它来修改配置。这样的 npmrc 文件优先级由高到低包括：

-   工程内配置文件: /path/to/my/project/.npmrc
-   用户级配置文件: ~/.npmrc
-   全局配置文件: \$PREFIX/etc/npmrc (即 npm config get globalconfig 输出的路径)
-   npm 内置配置文件:/path/to/npm/npmrc

### 常用配置 proxy(指定代理)，registry(指定安装源)

```
proxy = http://proxy.example.com/
https-proxy = http://proxy.example.com/
registry = http://registry.example.com/
```

## npm 模块

### 模块目录规范

-   package.json ：描述文件，必须

-   bin：存放可执行二进制文件目录
-   lib：存放 js 代码的目录
-   doc：存放文档
-   test：存放单元测试

### 模块发布

-   注册账号

-   本地添加账号

```
npm adduser
```

-   根据提示输入用户名和密码

-   npm publish：这里发布前一定要修改版本号比之前的大，才能发布

### 开发调试

-   npm link ：连接到对应包，在 node_module 会看到

-   npm unlink：取消关联
