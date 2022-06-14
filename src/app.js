"use strict";
class MyClass {
    constructor() {
        this.x = true;
    }
    check(s) {
        return this[s]; // 使用类型断言为boolean类型
    }
}
var m = new MyClass();
var x = m.check('x');
console.log(x);
