// function New(fn, ...args) {
//   var obj = {}
//   obj.__proto__ = fn.prototype
//   var ret = fn.apply(obj, args)
//   console.log(typeof ret);
//   return typeof ret === 'object' ? ret : obj
// }

function New(...args) {
  var fn = [].shift.call(args)
  var obj = {}
  obj.__proto__  = fn.prototype
  console.log(args);
  var ret = fn.apply(obj, args)
  return typeof ret === 'object' ? ret : obj
}

var Person = function (name, age) {
  this.name = name
  this.age = age
}
Person.prototype.hello = function name(params) {
  console.log('hello');
}

// var p = New(Person,'ceshi',23)

// console.log(p.hello());
// console.log(p instanceof Person);




Function.prototype.Call = function (obj,...args) {
  obj.fn = this
  console.log(obj.fn);
  var ret = obj.fn(...args, 'ssss', 1111)
  return ret
}

var o = {}
var s = Person.Call(o)
console.log(s);


// 如何构造一个指定内容的数组

// 如何实现 flat  ，使用 reduce

// 摄像头视频里 TypedArray 和 ArrayBuffer