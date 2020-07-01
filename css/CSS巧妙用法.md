# CSS

-   1、shape-outside：circle()你以为自己是方的，在别人眼里你却是圆的
-   2、flex 布局下 子元素使用 margin:auto|left|right 可调整子元素的对齐方式
-   3、flex 布局：当 flex-grow 之和小于 1 时，只能按比例分配部分剩余空间，而不是全部
-   4、input：给元素设置 display:block 不会自动填充父元素宽度。input 就是个例外，其默认宽度取决于 size 特性的值
-   5、position：绝对定位和固定定位时，同时设置 left 和 right 等同于隐式地设置宽度
-   6、相邻元素，兄弟选择器（+）：解决盒子有边框，内部列表也有边框的边框重复问题

```
ul > li +li {
  border-top:1px solid red
}
```

-   7、css 绘制三角形原理：

```
div{
  width:0;
  border:100px solid;
  border-color: red transparent transparent  transparent;
  border-width:50px
}
```

-   8、表格布局中 border-spacing 属性设置相邻单元格的边框间的距离（仅用于“边框分离”模式）

```
border-spacing:10px 50px
```

-   9、定宽高比：

```
.box{
  width:200px;
  dispaly:flex;
}
.box::after{
  content:'';
  padding-top:100%;
}
```

-   10、object-fit 使北京图片保持比例

```
{
  object-fit:contain:cover
}
```

-   11、按钮禁用后的鼠标状态

```
{
  cursor:not-allowed;
}
```

-   12、宽度使用：fill-available 使 inline-block 元素，充满整个空间

```
{
  display:inline-block;
  width:-webkit-fill-available;
}
```

-   13、设置宽度：fit-content ，使 block 元素想 inline-block 那样，收缩包裹内容，而不会因为 block 占用全部空间，内部大片空白

```
{
  display:block;
  width:fit-content;
}
```

-   14、width:min-content/max-content,使内容尽可能低收缩或展开

-   15、CSS 自定义属性：可做进度条

```
<div class="progress" style="--percent:50"></div>
.progress{
  height: 10px;
  width:100%;
  border-radius:5px;
  border:1px solid #333;
  background-image:linear-gradient(#0ff,#0ff);
  background-repeat: no-repeat;
  background-size: calc(var(--percent) * 1%);
}
```

-   16、css 配合图片做动画 （逐帧动画）

```
div{
width:48px;
height:60px;
background:url(player.png) no-repeat;
animation:move 2s steps(10) infinite;
}

@keyframes move{
  100%{
    background-position:-480px 0; // 具体根据雪碧图图片位置调整
  }
}
```

-   17、resize：auto ，使普通元素可以 resize 大小
