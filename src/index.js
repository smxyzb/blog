function Iterator(params) {
  let index = 0
  return {
    next(){
      return index< params.length?{
        value:params[index++],
        done:false
      }:{
        value:undefined,
        done:true
      }
    }
  }
}

function generator(genF, resolve, reject) {
  let result = null
  try{
    result = genF()
  }
  catch(error){}
  console.log(result);

  while (!result.done) {
    result = generator(function myFn(params) {
      return it.next(result.value)
    })
  }
  return result
}

function Await(syncFn) {
  return generator(syncFn)
}

// ES5
const it = Iterator([1, 2, 3])
var g = function myFn() {
  const next = it.next()
  return next
}
// ES6 
function* genF() {
  yield 1
  yield 2
  yield 3
  return 4
}

let res1 =  Await(g)
console.log('res1');
console.log(res1);
let res2 = Await(genF)
console.log('res2');
console.log(res2);


