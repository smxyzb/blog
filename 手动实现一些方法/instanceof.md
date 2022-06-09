# instanceof
```
var o = {}
function instance_of(obj, source) {
  let L = obj.__proto__
  let O = source.prototype
  while (L !== null) {
    return L === O
  }
  L = L.__proto__
}

console.log(instance_of(o, Object));
console.log(Array.isArray(new Set()));
console.log(typeof []);
```
