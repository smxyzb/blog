# Class

## ES5 和 ES6 class 的构造方法

```
function A(){
  this.x = 1
  this.y = 1
}
A.prototype.say = function () {
  return '(' + this.x + ', ' + this.y + ')';
};
class A {
  constructor(props){
    super(props)
    this.x = 1
    this.y = 2
  }
  say(){
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

### 在 class 中有一个 constructor 方法，这就是构造方法，如果没写，会被默认添加

### class 中 this 指向的是实例对象

```
var b = new A()
console.log(b.x); // 1
console.log(A.x); // undefined
```

### 实例对的属性除非显式地定义字啊其本身（this）上,否则都是定义在实例的原型上的,如下 b 实例只有一个 x，我们并没有看到 say 方法

```
console.log(b) // {x:1}
console.log(b.say()) // 3
```

### class 内部的所有方法都是不可枚举的，因为都是定义在原型上的

## class 的 setter 和 getter

```
class A {
  constructor(props) {
    this.y = 2
  }
  get x() {
    return this.y.toString()
  }
  set z(val) {
    return  val * 10
  }
}

```

## 属性名表达式

```
const methodName = 'key'
class A{
  [methodName]() {
    // ...
  }
}
```

## class 表达式

```
let b = class A {
  name = 'classA'
  constructor(props) {
    this.y = 2
  }
  say() {
    return this.y.toString()
  }
}

// 立即执行
let b = new class A {
  constructor(props) {
    this.y = 2
  }
  say() {
    return this.y.toString()
  }
}()
console.log(b.y)
```

## class 里面的 super 与 this 的区别

### super :ES6 要求，子类的构造函数必须执行一次 super() 函数

#### 只能在 constructor 中使用

##### super 作为函数调用时，内部的 this 指向子类实例，

##### 可以做对象使用

1、在普通方法中，指向父类的原型对象

```
class A {
  name = 'classA'
  p() {
    return 2;
  }
}
class B extends A {
  constructor() {
    super();
    console.log(super.p()); // 2  此时的super指向父类原型对象，即 A.prototype
  }
}
```

2、在静态方法中，指向父类。方法内部的 this 指向当前的子类，而不是子类的实例

```
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }
  myMethod(msg) {
    console.log('instance', msg);
  }
}
class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }
  myMethod(msg) {
    super.myMethod(msg);
  }
}
Child.myMethod(1); // static 1
var child = new Child();
child.myMethod(2); // instance 2
```

### this：

#### this 指向的是类的实例对象，单独使用实例方法的时候需要注意 this 的指向问题

```
let b =  class A {
  constructor(props) {
    this.y = 2
  }
  say() {
    return this.y.toString()
  }
}
let say = new A().say
say() // Cannot read property 'y' of undefined
```

解决方法可以在 constructor 使用 bind 绑定 this，或者使用箭头函数，或者使用 Proxy 拦截绑定 this

```
constructor(props) {
  this.say = this.say.bind(this)
}

constructor(props) {
  this.say2 = () => this.say()
}
```
