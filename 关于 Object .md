#### Object 的key值
	通常 我们创建对象的时候是这样： 
	```
	var o = {a:1}
	```
	添加属性的时候是这样
	```
	o['a'] = 2
	```
	都知道，key 必须是一个字符串，即便是一个变量，也会被强制转成字符串。但是当 key 是一个对象的时候呢？ 
	先看下效果
	```
	var o = {a:1,b:2};
	var obj = {c:3};
	obj[o] = 4;
	console.log(obj); //结果是 {c: 3, [object Object]: 4}
	```
	这里 o 对象被转换成了 [object Object] ，咦似乎在哪见过，没错，这里就是进行了一次隐式转换
	首先是将 对象 o 这个key准换成字符串
	```
	var str = Object.prototype.toString.call(o);//[object Object]
	obj[str] = 4
	```
	实际上就是调用了对象的原型方法toString，有什么用？你可能会遇到以下情况：
	```
	var obj = {test:false}
	var obj1 = {a:1,b:2}
	var obj2 = {c:3,d:4}
	var obj3 = [1,2,3]
	obj[obj1] = 5;
	obj[obj2] = 6;
	obj[obj3] = 7;
	console.log(obj[obj1]);//6
	console.log(obj[obj2]);//6
	console.log(obj[obj3]);//7
	```
	es6 提供了Map 方法,可以使用object 来做 key ，通过set，get方法设置和获取 key 值
	```
	var o = new Map();
	o.set(obj1,8);
	o.get(obj1);// 8
	o.set(obj1,9);
	o.get(obj1);//9
	```
	与普通对象一样 同样的key值将会被最后一个覆盖,再看下面的
	```
	var obj4 = ['a','b']
	var obj5 = ['a','b']
	o.set(obj4,10);
	o.set(obj5,11);
	o.get(obj4);//10
	o.get(obj5);//11
	o['a'] = 123;
	o['a'] = 234;

	o[null] = 345;
	o[null];//345

	console.log(o['a']);//234
	```	
	可以看出，Map 生成的对象 当 key 值是 引用类型的时候，这个key 是按地址来绑定的。（<a href='http://es6.ruanyifeng.com/#docs/set-map'>阮一峰es6入门教程</a>）
	obj4 和obj5 是两个不同的对象数组，自然地址不一样。
	而基本类型的 key 值还是按值引用

	key 的遍历：
	keys()：返回键名的遍历器。key 是基本类型的key的数组
	values()：返回键值的遍历器。返回 key 是基本类型的值的数组
	entries()：返回所有成员的遍历器。返回 key 是基本类型的 key与value组成的数组
	forEach()：遍历 Map 的所有成员。返回 key 是引用类型的值

