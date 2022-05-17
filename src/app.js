"use strict";
function firstEle(arr) {
    return arr[0];
    // return 100 // 不能将类型“number”分配给类型“Type”
}
firstEle([1, 2, 3]);
firstEle(['1', '2', '3']);
function map(arr, func) {
    return arr.map(func);
}
var s = map(['1', '2', '3'], (n) => parseInt(n));
console.log(s);
