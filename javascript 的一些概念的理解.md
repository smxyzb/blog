####原型 (prototype)、原型链 : javascrip 中万物接对象，主要分为普通对象和函数对象。prototype 是只有函数对象才具有的属性
 当通过new 方法创建一个对象时，会经过三个过程：执行构造函数的代码，生成并返回一个新对象，设置新对象的this。那么这个新对象的构造函数constructor就指向原来的对象
 ```
 var a = function(){
	this.hello = function(){
		console.log("hello")
	}
}
var b = new a()
b.constructor===a //true
```
#### 原型链：原型链通常是针对构造函数而言的，所有的对象都有一个__proto__ 属性，这个属性指向该对象的构造函数的原型,即
```
b.__proto__=== a.prototype
```
当我们使用 b 的属性或者方法时，会先到b上查找有没有这个属性，如果有则直接使用，如果没有则到b的原型属性 __proto__ (这里并不是在prototype上查找)上去查找。正如上面所说的js中万物皆对象,如果未找到就在继续往下查找，直到查找到该属性或者查找到对象的最底部返回null。这种自上而下的查找过程就会形成一个链条，这个链条就叫原型链。 b.__proto__=== a.prototype 相当于是在构造函数的原型 prototype 上查找


#### 事件绑定、事件监听和事件委托
	1、首先熟悉下浏览器标准事件机制：分为 捕获阶段、目标阶段、冒泡阶段 。 
		![Image text](https://github.com/smxyzb/blog/blob/master/img/event.jpg)

	2、事件绑定：就是对DOM 绑定各种事件以触发各种处理函数或者方法如onclick、onmouseover、keyup、keydown等等事件。 
	3、事件监听：用 addEventListener() 或 attachEvent() 来绑定事件监听函数
			```element.addEventListener(event, function, useCapture);
			   element.attachEvent(event, function);
			```  
			event : （必需）事件名，支持所有 DOM事件 。  
			function：（必需）指定要事件触发时执行的函数 。  
			useCapture：（可选）指定事件是否在捕获或冒泡阶段执行。true，捕获。false，冒泡。默认false  
		优点：1）可以绑定多个事件，单个DOM对象重复绑定只执行一次。但是，单个DOM多次获取并且多次绑定都会执行；	
			  2）绑定过的事件可以被解除
			  3）事件监听支持封装。
	4、事件委托：利用事件冒泡的原理把事件加到父元素或者祖先元素上，触发执行效果
		常见的 ``` document.onclick = function(evt){} ```  
		优点：1）高性能，提高事件处理速度，减少内存占用。同时也可以少些代码
			  2）动态添加的元素无需再次绑定或者修改事件绑定  
	5、所有事件都会冒泡吗
		1）被阻止的不会冒泡，标准模式下 使用event.stopPagegation() 阻止事件冒泡，IE中使用event.cancelBubble  = true。
		2）父元素或者祖先元素的事件不同的不会冒泡，比如子元素绑定click，而父元素绑定mouseover 不会冒泡。
	
	