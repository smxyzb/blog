function curryFn(fn) {
  console.log('curryFn', fn.length);
  function _curried(...args) {
    return function () {
      var allArgs = args.concat(Array.from(arguments));
      console.log(allArgs);
      if (allArgs.length >= fn.length) {
        return fn.apply(this, allArgs);
      } else {
        return _curried.apply(fn, allArgs);
      }
    }
  }
  return _curried
}

var plus = function (a,b,c,d) {
  // console.log(a,b,c,d);
  return a+b+c+d;
}
var add = curryFn(plus)
console.log(add(1)(2)(3)(4));
console.log(add(1,2,3)(4));
console.log(add(1)(2)(4,5));


