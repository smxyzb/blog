
class MsgError extends Error {
  constructor(m:string){
    super(m)
    // es5 环境下需要设置原型
    Object.setPrototypeOf(this,MsgError.prototype)

  }
  show(){
    console.log(this.message);
  }
}

var m = new MsgError('hello')
console.log(m.show());
