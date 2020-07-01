#### flex:Flexible Box 弹性和字布局的简称
设置为flex 后元素的float、clear、vertical-algn 将失效

##felx 容器：
采用flex布局对的元素称为flex容器（flex-container）。所有子元素自动称为容器成员，称为felx 项目felx-item
容器默认存在两根轴，水平方向上的主轴，垂直方向上的交叉轴，主轴的开始位置叫做main-start，结束位置叫main-end；交叉轴的开始位置叫cross-start，结束位置叫cross-end；

## 容器属性：
有6个属性是设置在容器上的：
flex-direction：决定主轴的方向,有row、row-reverse、column、column-reverse 四个取值，默认为row
flex-wrap:默认情况下项目都排在一条直线上，即主轴上，flex-wrap 定义一行排不下的时候的换行方式，有nowrap、wrap、wrap-reverse
flex-flow：是flex-direction和flex-wrap 的简写形式 <flex-direction>||<flex-wrap>
justify-content:定义了在主轴方向对的对齐方式，有flex-start、flex-end、center、space-between、space-around
align-items：定义项目在交叉轴上的对齐方式，有flex-start、flex-end、center、baseline、strech。其中baseline为按项目的第一行文字基准线对齐，strech为默认值，默认占满整个高度
align-content：定义了多跟轴线的对齐方式。但是如果项目只有一跟轴线的话，不起作用。

这里需要注意：
    <strong>align-items：只是对单根轴线起作用，多轴的情况下，除第一根轴外其他轴线会失效。</strong>
    <strong>align-content：对单轴线不起作用。</strong>

## 项目属性
有6个属性作用在项目上
order：蒂尼项目对的排列顺序，数值越靠前
flex-grow：定义了项目的放大比例，<strong>默认为0</strong>，如果存在剩余空间也不进行放大
flex-shrink：定义项目的缩放比例，当空间不够的时候，自动将目标项目缩小，<strong>默认1</strong>
flex-basic：定义了在分配多余空间之前，项目占据对的主轴空间，浏览器根据这个属性，计算主轴是否有多余空间，默认auto，即项目本身大小
flex：是flex-grow、flex-shrink、flex-basic的组合简写形式，默认 <strong>0 1 auto</strong>，该属性有两个快捷值<strong>auto(1 1 auto)</strong><strong> none(0 0 auto)</strong> 建议优先使用这两个值
align-self：允许的那个项目有与其他项目不一样的对齐方式，可覆盖align-items属性，<strong>默认为auto</strong>，表示继承父元素的align-items属性，如果没有父元素则等同于strech，其他值与align-items 一样
