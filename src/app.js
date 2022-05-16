"use strict";
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 1] = "UP";
    Direction[Direction["DOWN2"] = 2] = "DOWN2";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
    Direction[Direction["LEFT"] = 4] = "LEFT";
})(Direction || (Direction = {}));
console.log(Direction.UP);
const a = BigInt(100);
const b = Symbol('222');
function test(x, y) {
    if (x === y) {
        x.toUpperCase();
        y.toUpperCase();
    }
}
function move(animal) {
    if ('swim' in animal) {
        animal.swim();
    }
}
