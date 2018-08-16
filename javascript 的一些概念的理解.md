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

#### 继承：js 继承指的是子类继承父类的方法
	1）通过构造函数继承  
	```
		function person(name){
			this.name = name||'myname'
			this.hello = function(){
				console.log('i am person')
			}
		}
		person.prototype.habit  =  '吃饭睡觉'
		var my = new person();
		my.hello();// i am person
		console.log(my instanceof person);//true
	```
	这里my继承了person的hello 方法。我们知道当使用new创建一个对象的时候，会经过三个过程：创建一个空对象；设置新对象的constructor 为构造函数，设置新对象的__proto__ 属性指向构造函数的prototype，执行构造函数的代码；最后返回新对象。
	输出my显示：
	![Image text](https://github.com/smxyzb/blog/blob/master/img/jicheng.png)
	特点：a、可以实现多重继承，call 多个父类；
		```  
			var person2 = function(){
				person.call(this,'zhang')
			};
			person2.prototype.eat = function(){
				console.log('eat');
			}
			var person3 = new person2()
			console.log(person3)
		```
		b、创建子类的时候可以向父类传参；
		c、父类原型不共享。
		```
			person3.habit;//undefined  
		```
		
	2）通过原型继承：将父类的实例赋值给子类的原型
	```
	var newPerson = function(){};
		newPerson.prototype = new person('myLi');
	var newPerson2 = new newPerson();
	newPerson2.hello();//i am person
	console.log(newPerson2 instanceof person);//true
	```
	特点：a、父类的方法子类都能访问到，父类改变，子类也跟着改变
		```
		person.prototype.say = function(){console.log('你好')}
		newPerson2.say();// 你好
		```
		b、无法实现多重继承；
		c、来自父类的原型对象时所有子类共享的；
		d、创建子类实例时，无法向父类构造函数传参；

	3）通过实例继承：在父类的实例上加新方法，作为子类实例的返回
	``` 
		var person2 = function(name){
			var child = new person();
			child.name = name || 'amy';
			return child
		}
		var person3 = new person2('zhang')
		console.log(person3.name);//zhang
		console.log(person3.hello());// i am person
		console.log(person3 instanceof person);//true
	```
	4）通过拷贝继承 ：将父类的方法拷贝给子类或者其他对象主要是遍历父类的方法并赋值给子类
	5） 组合继承：以上几种方式的组合；
	6）es6 中的 class 继承：
		```  
		class person2 extends person {
			constructor(props){
				super(props);
				this.hello = function(){
					console.log('i am person2')
				}
			}
			hello(){
				console.log('i am person3')
			}
		}
		var person3 = new person2();
		console.log(person3.hello());//1 am person2 为什么不是i am person3 ? 
		console.log(person3 instanceof person);//true
	```  
	class 中所有的方法都是写在原型上的，并且都是不可枚举的，所以不能被遍历出来，也是不可以继承到子类的；如果要继承的话需写在constructor 里面这样就自动继承过去了。

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
	
	
#### DOM 中property 与 attribute 的区别 
	property :DOM 的默认的基本属性，原始属性，存储于DOM对象上。即使没写在 dom 标签上，在创建dom的时候也会被初始化，property 可以被修改成任意类型。
	```
	<div id='box' class='box'></div>
	var d = document.getElementById('box');
	d.id;//box
	d.className;// box
	d.id = 'box2';
	d.id = {'a':'a'}
	```
	attribute ：自定义属性、特性 ，只能是一个字符串。使用setAttribute 和 setAttribute 设置和获取的属性值都是一个字符串。DOM的 attributes 是一个类数组对象，存储量若干个attribute。
	
	使用上： 1）property 直接通过 DOM 对象获取对应的名称 [DOMObject].propertyName；
		    2）attribute 通过setAttribute 和 getAttribute 设置和获取；

	数据绑定:
		attributes的数据会同步到property上，然而property的更改不会改变attribute；
		
	关系：  1）attributes的数据会同步到property上，然而property的更改不会改变attribute；
		    2）默认属性 通过 attribute 会被同步到 property 中，但是自定义属性不会被同步到property中；
			3）对于value，class这样的属性/特性，数据绑定的方向是单向的，attribute->property；
			对于id而言，数据绑定是双向的，attribute<=>property；
			对于disabled而言，property上的disabled为false时，attribute上的disabled必定会并存在，此时数据绑定可以认为是双向的；