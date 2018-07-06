##原型 (prototype)、原型链 : javascrip 中万物接对象，主要分为普通对象和函数对象。prototype 是只有函数对象才具有的属性
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
### 原型链：原型链通常是针对构造函数而言的，所有的对象都有一个__proto__ 属性，这个属性指向该对象的构造函数的原型,即
```
b.__proto__=== a.prototype
```
当我们使用 b 的属性或者方法时，会先到b上查找有没有这个属性，如果有则直接使用，如果没有则到b的原型属性 __proto__ (这里并不是在prototype上查找)上去查找。正如上面所说的js中万物皆对象,如果未找到就在继续往下查找，直到查找到该属性或者查找到对象的最底部返回null。这种自上而下的查找过程就会形成一个链条，这个链条就叫原型链。 b.__proto__=== a.prototype 相当于是在构造函数的原型 prototype 上查找
