"use strict";
class MsgError extends Error {
    constructor(m) {
        super(m);
        // es5 环境下需要设置原型
        Object.setPrototypeOf(this, MsgError.prototype);
    }
    show() {
        console.log(this.message);
    }
}
var m = new MsgError('hello');
console.log(m.show()); // hello
console.log(m instanceof MsgError); //true
