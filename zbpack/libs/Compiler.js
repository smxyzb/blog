let path = require('path')
let babylon = require('babylon')
let t = require('@babel/types')
let traverse = require('@babel/traverse').default
let generator = require('@babel/generator').default
let ejs = require('ejs')
let fs = require('fs')
class Compiler {
  constructor(config) {
    this.config = config
    // 需要保存入口文件路径
    this.entryId;
    // 徐亚保存所有模块依赖

    this.modules = {}
    // 入口路径
    this.entry = config.entry
    // 工作路径
    this.root = process.cwd() || ''
  }
  getSource(ModulePath) {
    let content = fs.readFileSync(ModulePath, 'utf-8')
    return content
  }
  parse(source, parentPath) {
    console.log(source, parentPath);
    let ast = babylon.parse(source)
    let dependencies = []
    traverse(ast, {
      CallExpression(p) {
        let node = p.node
        if (node.callee.name === 'require') {
          node.callee.name = "__webpack_require__"
          let moduleName = node.arguments[0].value
          moduleName = moduleName + (path.extname(moduleName ? '' : '.js'))
          moduleName = './' + path.join(parentPath, moduleName)
          dependencies.push(moduleName)
          node.arguments = [t.stringLiteral(moduleName)]
        }
      }
    })

    let sourceCode = generator(ast).code
    return { sourceCode, dependencies }
  }
  buildModule(modulePath, isEntry) {
    // 拿到模块的内容
    let source = this.getSource(modulePath)
    // 拿到模块的ID,modulePath = modulePath- this.root
    let moduleName = './' + path.relative(this.root, modulePath)
    let { sourceCode, dependencies } = this.parse(source, path.dirname(moduleName))
    if (isEntry) {
      this.entryId = moduleName
    }
    this.modules[moduleName] = sourceCode
    dependencies.forEach(dep => {
      this.buildModule(path.join(this.root, dep), false)
    })
  }
  emitFile() {
    let main = path.join(this.config.output.main, this.config.output.filename)
    let templateStr = this.getSource(path.join(__dirname, 'main.js'))
    let code = ejs.render(templateStr, {
      entryId: this.entryId, modules: this.modules
    })
    this.assets = {}

    this.assets[main] = code
    fs.writeFileSync(main, this.assets[main])
  }
  run() {
    // 执行 并且创建模块依赖关系
    this.buildModule(path.resolve(this.root, this.entry), true)
    // 发射一个打包后的文件
    this.emitFile()
  }

}

module.exports = Compiler