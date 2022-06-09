# New 
```
function New(f) {
  var obj = {}
  obj.__proto__ = f.prototype
  var agrs = arguments.unshift()
  var ret = f.apply(obj, agrs)
  return ret instanceof Object ? ret : obj
}
```