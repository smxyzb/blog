

function dd() {
  this.a = 22
}
function create2() {
  // 1、创建一个空的对象
  var obj = new Object();
  // 2、获得构造函数，同时删除 arguments 中第一个参数
  console.log(arguments);
  var Con = [].shift.call(arguments);
  console.log(Con);
  // 3、链接到原型，obj 可以访问构造函数原型中的属性
  Object.setPrototypeOf(obj, Con.prototype);
  // 4、绑定 this 实现继承，obj 可以访问到构造函数中的属性
  var ret = Con.apply(obj, arguments);
  console.log(ret);
  // 5、优先返回构造函数返回的对象
  return ret instanceof Object ? ret : obj;
};


var ee = create2(dd)
console.log(ee);
function Animal(name) {
  this.name = name
}
Animal.prototype.bark = function () {
  console.log('bark');
}
// function Dog(obj) {
//   // Animal.call(this)
//   function ma() { }
//   ma.prototype = obj
//   return new ma
// }
// var d = new Dog(Animal)
// console.log(d);
// console.log(d.prototype === Animal.prototype);
// console.log(d.prototype.bark());

// var pro = Object.create(Animal.prototype)
// pro.constructor = Dog
// Dog.prototype = pro

// var dog = new Dog(11)
// console.log(dog.__proto__ === Dog.prototype);
// console.log(dog.bark());

function Animal(name) {
  this.name = name
}
Animal.prototype.bark = function () {
  console.log('bark');
}
function Dog(name, age) {
  Animal.call(this, name)
  this.age = age
}
// 超类型原型副本
var pro = Object.create(Animal.prototype)
// constructor 属性
pro.constructor = Dog
// 将该完善好的副本赋值给子类型的原型
Dog.prototype = pro
// 新增子类原型属性
Dog.prototype.sayAge = function () {
  console.log
    (this.age);
}
var dog = new Dog(11, 29)
console.log(dog);
console.log(dog.sayAge());

class Rectangle {
  // constructor
  constructor(height, width) {
    this.height = height;
    this.width = width;
  }

  // Getter
  get area() {
    return this.calcArea()
  }

  // Method
  calcArea() {
    return this.height * this.width;
  }
}

const rectangle = new Rectangle(10, 20);
console.log(rectangle.area);
// 输出 200

// 继承
class Square extends Rectangle {

  constructor(length) {
    super(length, length);

    // 如果子类中存在构造函数，则需要在使用“this”之前首先调用 super()。
    this.name = 'Square';
  }

  get area() {
    return this.height * this.width;
  }
}

const square = new Square(10);
console.log(square.area);
// 输出 100