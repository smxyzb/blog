# SourceMap 是一种映射关系。当项目运行后，如果出现错误，错误信息只能定位到打包后文件中错误的位置。如果想查看在源文件中错误的位置，则需要使用映射关系，找到对应的位置

## source-map：会生成 map 格式文件，包含映射关系的代码

## inline-source-map：不会生成 map 文件，包含映射关系的代码会放在打包后的代码中

## inline-cheap-source-map：cheap 的作用一是只定位到行，不定位到列；二是映射业务代码，不映射 loader 和第三方库，可提升打包构建速度

## inline-cheap-module-source-map：module 会映射 loader 和第三方库
