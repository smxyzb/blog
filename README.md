# blog 日常学习、工作心得记录  
# <h1>一、HTML5.1 新增内容</h1>
## <h3>1、img 新属性srcset|sizes、picture元素</h3>  
#### img 标签：srcset 允许设置多个图片源，并根据不同的设备加载不同图片，以前的做法我们通常是使用js进行判断dpr，加载不同图片，现在可以抛弃js，直接使用srcset 和sizes 属性
#### 如：
```
<img class="image" src="./img/128.png" srcset="./img/128.png 128w, ./img/256.png 256w, ./img/512.png 512w" 
sizes="(max-width: 320px) 320px, 256px">
```
其中 srcset 前面为图片路径，128我，256w，512w表示图片大小规格，他们的最终值为屏幕dpr与屏幕宽度的乘积
#### picture 标签，自带媒体查询，并根据不要屏幕大小显示不要图片
```
	<picture>
		<source media="(max-width: 500px)" srcset="http://placehold.it/500"/>
		<source media="(max-width: 1000px)" srcset="http://placehold.it/1000"/>
		<source media="(max-width: 1500px)" srcset="http://placehold.it/1500"/>
		<source media="(max-width: 1920px)" srcset="http://placehold.it/1920"/>
		<img src="http://placehold.it/500/abc"/>
	</picture>
```