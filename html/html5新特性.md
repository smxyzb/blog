# 新的 Doctype 声明

```
<!Doctype html>
```

# 字符编码声明,不写的话 HTML5 默认也是 UTF-8

```
<meta charset="UTF-8">
```

# 语义化/结构化标签

## article，aside，detail，dialog，figcaption，figure，footer，header，main，mark，nav，section，summary，time

## 自定义标签

```
<figure>
//img和figcaption可以组合放在figure里
  <img src="pic_mountain.jpg" alt="The Pulpit Rock" width="304" height="228">
  <figcaption>Fig1. - The Pulpit Rock, Norway.</figcaption>
</figure>
```

# 新增 input 类型和属性

## 类型：color，date，datetime，datetime-local，email，month，number，range，serach，tel，time，url，week

## 属性：autocomplete，autofocus，form，formaction，formenctype，formmethod，formformnovalidate，formnovalidate，formtarget，height/width，list，min/max，pattern,placeholder,required，step，mutiple

# 新图形标签 svg 和 canvas

# 多媒体标签 video，audio

# 新浏览器 API

## Geolocation 地理位置

## Drag & Drop 拖放

## LocalStorage

## Application Cache

## Web Workers

## SSE

# 删除和废弃的标签

## 删除部分标签，使用 CSS 替代

```
<acronym> 首字母缩写 <abbr>
<applet>	<object>
<basefont> 页面上默认字体颜色和字号	CSS样式
<big> 更大的文本	CSS样式
<center> 文本水平居中	CSS样式
<dir> 目录列表	CSS样式
<font> 字体外观，尺寸，颜色	CSS样式
<frame> 定义子窗口
<frameset> 定义框架集
<noframes> 向浏览器显示无法处理框架的提示文本，位于frameset元素中
<strike> 文本添加删除线	CSS样式，<s>或<del>
<tt> 定义打字机文本
```

# 其他细节

## 闭合标签，双标签不写那个闭合的标签不会出现解析错误，但是建议闭合

## 单标签元素建议加 /来闭合；但在 XHTML 和 XML 文档中是必须要加的

## HTML5 元素命名 & class 等属性名允许混合使用大写和小写字母，但建议用小写

## 属性允许去除引号

## <html>,<body>,<header>标签甚至是可以省略的

## 通过 meta 标签达到监听并适配设备屏幕的布局

```
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```
