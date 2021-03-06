## 浏览器原理

### 主要组件：

1、用户界面：地址栏，后退前进，书签目录等  
2、浏览器引擎：用来查询及操作渲染引擎的接口  
3、渲染引擎：显示内容  
4、网络：用来请求 http 资源等  
5、UI 引擎：用来绘制类似组合选择框及对话框等基本组件，具有不特定于某个平台的通用接口，底层使用操作系统的用户接口  
6、JS 解释器：解释执行 JS 代码  
7、数据存储：各种本地存储

## 浏览器 j 输入网址到请求到渲染过程

### DNS 查询 : 浏览器缓存 -> 系统缓存（hosts，有则直接使用对于的 IP 地址发起请求，不在发起 IP 地址解析） -> 路由器缓存

### 域名 IP 地址解析：向本地 DNS 服务器 -> 其他远程 DNS 服务器 -> 根服务器，拿到域名的 Ip 地址

### http 请求：

#### TCP 三次握手：主要是为了确认客户端与服务的发送的信息有效，防止已失效的请求发送到服务端产生错误

#### 握手需要用到的几个东西：

序列号（Seq）：表示 TCP 段的第一个数据字节在整个数据流中的位置，也可以表示发送了多少数据确认号（ACKN）：接收端通过确认号来高速发送端接收成功了多少数据 SYN 同步标识，用来建立链接，在三次握手的前两次出现 ACK 确认标识：接收端确认接收到数据，TCP 协议规定，只有 ACK=1 时有效，确认号信息才会包含在 TCP 段内 FIN 结束标识:标识双方数据发送完成，FIN=1 时 TCP 段内不能包含其他主体信息  
1、首先是客户端初始化一个 seq=x（随机数），设置 SYN=1,发送给服务端，表明要建立连接  
2、服务器接收到后，如果可以连接，则会初始化自己的 seq = y （随机生成），设置 SYN=1，ACK=1 并根据客户端的 seq，设置 ACKN = x + 1 (这里的 x 是客户端发来的)，发送大客户端  
3、客户端收到后会再进行一次确认 设置 seq=x+1,ACK=1，ACKN = y + 1 (这里的 y 是服务端发来的)  
<img width="472" alt="me-sanci" src="https://user-images.githubusercontent.com/18378034/33086507-629bbf82-cead-11e7-93cd-40fd2571ea28.png" style="max-width:100%;">

数据传输过程(M,N 分别为传输的数据大小),最主要的是序列号(seq)和确认号(ackn)  
<img width="481" alt="me-chuan" src="https://user-images.githubusercontent.com/18378034/33086511-66cbd092-cead-11e7-8b18-fc0b25d7d04f.png" style="max-width:100%;"> 可以看出，每次的序列号将被用作下一次的确认号返回

### 四次挥手

1、第一次是连接的某一端 A 请求断开连接，发送报文段给 B，设置 seq = x 和 ackn = y，另外加一个标识位 FIN，表示已经没有数据发送了，请求断开。  
2、B 收到请求，需要进行确认，即设置 ACK = 1，然后是 ackn = x（A 的 seq） + 1，B 的 seq 仍然是 y，只是确认收到 A 的关闭请求。  
3、隔一段时间，B 再向 A 发送 FIN 报文段，请求关闭，FIN = 1，seq = y，ackn = x + 1。此时是最后确认阶段。  
4、A 收到 B 的 FIN，向 B 发送 ACK，确认关闭，seq = x + 1，ACK = 1，ackn = y + 1。发送完之后，A 会进入 TIME_WAIT 的阶段，如果 B 收到 ACK 关闭连接，A 在 2MSL （报文最大生存时间）收不到 B 的响应就自己默认关闭了如下图所示：  
<img width="483" alt="huishou" src="https://user-images.githubusercontent.com/18378034/33181749-01b3c2f6-d037-11e7-98eb-315678cd9625.png" style="max-width:100%;"> 四次挥手的原因是因为 B 是被动关闭一方，虽然 A 已经接收完毕，但是 B 可能还有数据发给 A，这里 B 就需要确认通过 ackn 确认，确认完成后才会关闭连接

### 资源解析

<img src="https://pic.xiaohuochai.site/blog/chrome4.jpeg" alt="chrome" width="1038" height="478">

### 渲染流程如下：

1、HTML 解析出 DOM Tree 2、CSS 解析出 Style Rules 3、将二者关联生成 Render Tree 4、Layout 根据 Render Tree 计算每个节点的信息 5、Painting 根据计算好的信息绘制整个页面 <img src="https://raw.githubusercontent.com/xuexueq/fileupload/8d8607c9de79b1b59f9768977d0ba9f7252a7ff2/images/blog/render.png" alt="渲染机制" style="max-width:100%;">

<strong>1、css 解析不会阻塞 DOM 的解析(HTML 的解析)，也不会阻塞 DOM tree 的构建<strong> <strong>2、css 解析会阻塞页面的渲染：因为如果不会阻塞页面渲染则 html 可能会先出现一种样式，待 css 解析完成后又出现一种样式，体验差，性能也差<strong> <strong>3、js 会阻塞页面渲染，遇到 script 就会立即停止文档的解析，并执行 js，因为 js 能够操作 dom 各种属性<strong>

## 回流与重绘

### 回流（重排）：回流是指窗口尺寸被修改、发生滚动操作，或者元素位置相关属性被更新时会触发布局过程，在布局过程中要计算所有元素的位置信息

### 触发回流包括如下操作：

1、DOM 元素的几何属性变化　　 2、DOM 树的结构变化　　 3、修改下列属性 offsetTop\offsetLeft\offsetWidth\offsetHeight\scrollTop\scrollLeft\scrollWidth\scrollHeight\clientTop\clientLeft\clientWidth\clientHeight\getComputedStyle()\currentStyle() 　　 4、改变元素的一些样式　　 5、调整浏览器窗口大小

### 重绘：重绘是指当与视觉相关的样式属性值被更新时会触发绘制过程，在绘制过程中要重新计算元素的视觉信息，使元素呈现新的外观

<strong>opacity:0-1 的过程会触发回流，0-.9 则只会触发重绘</strong>

### 优化措施：

    1、避免直接修改DOM样式，通过修改lassName或者修改style.cssText

2、在内存中多次操作节点，完成后再添加到文档中去　　 3、对于一个元素进行复杂的操作时，可以先隐藏它，操作完成后再显示　　 4、在需要经常获取那些引起浏览器回流的属性值时，要缓存到变量中　　 5、减少使用 table 布局，因为一个小改动可能会造成整个 table 重新布局。而且 table 渲染通常要 3 倍于同等元素时间

### CSS 的优化

不适用@import ，减少层级嵌套，避免嵌套过深，合理利用 css 的继承 所有元素可继承：visibility 和 cursor 内联元素和块元素可继承：letter-spacing、word-spacing、white-space、line-height、color、font、 font-family、font-size、font-style、font-variant、font-weight、text- decoration、text-transform、direction 块状元素可继承：text-indent 和 text-align 列表元素可继承：list-style、list-style-type、list-style-position、list-style-image 表格元素可继承：border-collapse

### 有哪些线程

1、 GUI 渲染线程  
2、 JS 引擎线程  
3、 事件触发线程  
4、 定时器触发线程  
5、异步 http 请求线程

其中 GUI 渲染线程与 JS 引擎线程是互斥的，因为技术可以修改页面 DOM，可能造成渲染不一致等问题

## 各种场均状态码

### 100 : 服务端接收到请求，需要只想着继续操作

### 200 ：请求成功

201 ：已创建请求  
202 ：已接收请求  
203 ：非授权信息  
204 ：no content ，请求成功，但未返回内容  
205 ：重置内容  
206 ：部分内容，成功处理了部分请求，一般在分段上传出现

### 300

301 ：永久重定向到某个地址  
302 ：临时重定向到某个地址  
304 ：所请求的资源未修改，通常是协商缓存的结果

### 400 错误的请求，服务器无法理解

401 ：没权限，需要用户认证  
402 ：保留，将来使用  
403 ：接收到请求，但禁止访问  
404 ：资源未找到  
405 ：method not allowed ，请求方法不被允许

### 500 服务器内部错误

501 : 服务器不支持的请求功能，无法完成  
502 ：无效的请求，网关错误，通常在重启  
503 ：服务暂时不可用，暂时无法处理请求  
504 : 服务器未及时返回内容  
505 ：请求的 http 协议不被支持

## websocket 有几种数据协议

ws 和 wss (类似 https 的 ws 协议)

## GET POST 最大区别

GET 发送一个 TCP 数据包，而 POST 产生两个 TCP 数据包 对于 GET 方式的请求，浏览器会把 http header 和 data 一并发送出去，服务器响应 200（返回数据）； 而对于 POST，浏览器先发送 header，服务器响应 100 continue，浏览器再发送 data，服务器响应 200 ok（返回数据）

## HTTP2 和 http1 的区别

### http1：在 HTTP/1 中，每次请求都会建立一次 HTTP 连接，也就是我们常说的 3 次握手 4 次挥手，这个过程在一次请求过程中占用了相当长的时间，即使开启了 Keep-Alive ，解决了多次连接的问题，但是依然有两个效率上的问题

#### 串行的文件传输。当请求 a 文件时，b 文件只能等待，等待 a 连接到服务器、服务器处理文件、服务器返回文件，这三个步骤

#### 连接数过多,超出最多并发连接数，多个请求必须创建多个 TCP 连接

### http2

#### HTTP2 采用二进制格式传输。数据流以消息的形式发送，消息由一个或多个帧组成；帧可以乱序发送，根据帧头部的流标识重新组装

#### 多路复用：即一个域名下的请求都可以使用同一个 TCP 连接，通过数据流（Stream）以帧为基本协议单位，减少握手次数，解决阻塞问题

#### 单个连接可以承受任意数量的双向数据流
