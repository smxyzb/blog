function Iterator(params) {
  let index = 0
  return {
    next: function name() {
      return index < params.length ? {
        value: params[index++],
        done: false
      } : {
        value: undefined,
        done: true
      }
    }
  }
}

// const it = Iterator([1, 2])
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());


function generator(fn, resolve, reject) {
  let result
  try {
    console.log('try', fn);
    result = fn()
  } catch (error) {
    reject(error)
  }
  console.log('result', result);
  if (result.done) {
    console.log('done');
    return resolve(result)
  }
  Promise.resolve(result.value).then((v) => {
    // console.log('next generator',v);
    generator(function myFn(params) {
      return it.next(v)
    }, resolve, reject)
  })
}

const it = Iterator([1, 2, 3])

// generator(function myFn() {
//   const next = it.next()
//   return next
// })

function Await(genF) {
  console.log(genF);
  return new Promise((resolve, reject) => {
    generator(genF, resolve, reject)
  })
}

var a = async function name(params) {
  var g = function myFn() {
    const next = it.next()
    return next
  }
  let res = await Await(g)
  console.log(res);
}
// a()


function* genF() {
  yield 1
  yield 2
  yield 3
  return 4
}

var b = async function name(params) {
  let res = await Await(genF)
  console.log(res);
}

b()