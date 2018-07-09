# <h1>一、HTML5.1 新增内容</h1>
#### <h3>1、img 新属性srcset|sizes、picture元素</h3>  
#### img 标签：srcset 允许设置多个图片源，并根据不同的设备加载不同图片，以前的做法我们通常是使用js进行判断dpr，加载不同图片，现在可以抛弃js，直接使用srcset 和sizes 属性
#### 如：
```
<img class="image" src="./img/128.png" srcset="./img/128.png 128w, ./img/256.png 256w, ./img/512.png 512w" 
sizes="(max-width: 320px) 320px, 256px">
<img class="image" src="./img/128.png" srcset="./img/128.png 128w, ./img/256.png 256w, ./img/512.png 512w" 
sizes="(-webkit-min-device-pixel-ratio: 2) 320px, 256px">
```
其中 srcset 前面为图片路径，128我，256w，512w表示图片大小规格，他们的最终值为屏幕dpr与屏幕宽度的乘积
sizes 意思是最大宽度为320px 的时候图片大小为320px，其他情况为256px
#### picture 标签，自带媒体查询，并根据不要屏幕大小或者dpr显示不要图片
```
<picture>
	<source media="(-webkit-min-device-pixel-ratio: 2)" srcset="http://placehold.it/500"/>
	<source media="(max-width: 1000px)" srcset="http://placehold.it/1000"/>
	<source media="(max-width: 1500px)" srcset="http://placehold.it/1500"/>
	<source media="(max-width: 1920px)" srcset="http://placehold.it/1920"/>
	<img src="http://placehold.it/500/abc"/>
</picture>
```
#### <h3>detail 、summary 组合。概览和详情切换</h3>
```
<details> 
	<summary>我是概览信息(点我查看详情)</summary> 
	<div>我是隐藏的详细信息</div> 
</details>
```

#### <h3>零宽度图像,用来添加不想用户展示但是需要用的的图片</h3>
```<img src="yourimage.jpg" width="0" height="0" alt="">```、

#### <h3>分隔浏览器上下文 rel='noopener'</h3>
```<a href="#" target="_blank" rel="noopener"> Your link that won't make troubles </a>```
可以在a、map标签中使用它，对于老旧的浏览器不支持 rel 属性的可以使用下面的方法 
```var otherWindow = window.open();
otherWindow.opener = null;
otherWindow.location = url;
```

#### <h3>figcaption  可以出现在 figure 中的任意位置</h3>
此前 figcaption标记只能用作 figure 的第一个或最后一个标签,处理图片更加灵活

#### HTML5常见的取值与单位
相对长度单位包括：em, ex, ch, rem, vw, vh, vmax, vmin

绝对长度单位包括：cm, mm, q, in, pt, pc, px

ch:数字“0”的宽度

em:相对于当前对象内文本的字体尺寸。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。

ex:相对长度单位。相对于字符“x”的高度。通常为字体高度的一半。如当前对行内文本的字体尺寸未被人为设置，则相对于浏览器的默认字体尺寸。

rem:相对于根元素(即html元素)font-size计算值的倍数

vw:相对于视口的宽度。视口被均分为100单位的vw

vh:相对于视口的高度。视口被均分为100单位的vh

vmax:相对于视口的宽度或高度中较大的那个。其中最大的那个被均分为100单位的vmax

vmin:相对于视口的宽度或高度中较大的那个。其中最大的那个被均分为100单位的vmax

cm:厘米     1in = 2.54cm = 25.4 mm = 101.6q = 72pt = 6pc = 96px

mm:毫米    1in = 2.54cm = 25.4 mm = 101.6q = 72pt = 6pc = 96px

q:1/4毫米   1in = 2.54cm = 25.4 mm = 101.6q = 72pt = 6pc = 96px

in:英寸       1in = 2.54cm = 25.4 mm = 101.6q = 72pt = 6pc = 96px

pt:点          1in = 2.54cm = 25.4 mm = 101.6q = 72pt = 6pc = 96px

pc:派卡      1in = 2.54cm = 25.4 mm = 101.6q = 72pt = 6pc = 96px

px:像素      1in = 2.54cm = 25.4 mm = 101.6q = 72pt = 6pc = 96px