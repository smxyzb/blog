class MyClass {
  [s:string]:boolean|((s:string)=>boolean)
  x = true
  check(s:string){
    return this[s] as boolean // 使用类型断言为boolean类型
  }
}
var m = new MyClass()
var x = m.check('x')
console.log(x);
