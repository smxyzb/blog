# blog 日常学习、工作心得记录  
# <h1>一、HTML5.1 新增内容</h1>
## <h3>img 新属性srcset|sizes、picture元素</h3>  
#### 1、srcset 允许设置多个图片源，并根据不同的设备加载不同图片，以前的做法我们通常是使用js进行判断dpr，加载不同图片，现在可以抛弃js，直接使用srcset 和sizes 属性
#### 如：
<code>
<img class="image" src="128.png" srcset="./img/128.png 128w, ./img/256.png 256w, ./img/512.png 512w" sizes="(max-width: 320px) 320px, 256px">
</code>