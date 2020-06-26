// function Await(genF) {
//   return new Promise((resolve, reject) => {
//     const gen = genF()
//     function step(nextF) {
//       let next
//       try {
//         next = nextF()
//       } catch (error) {
//         reject(error)
//       }
//       if (next.done) {
//        return resolve(next.value)
//       }
//       Promise.resolve(next.value).then((v) => {
//         step(function name(params) {
//           return gen.next(v)
//         })
//       })
//     }

//     step(function () {
//       return gen.next()
//     })
//   })
// }

// function* genF() {
//   yield 1
//   yield 2
//   yield 3
//   return 4
// }

// var a = async function name(params) {
//   let res = await Await(genF)
//   console.log(res);

// }
// a()

// for (let [index, elem] of ['a', 'b'].entries()) {
//   console.log(index, elem);
// }


function Iter(arr) {
  let index = 0
  return {
    next(val) {
      return index < arr.length ? { done: false, value: arr[index++] } : {
        done: true, value: undefined
      }
    }
  }
}

const it = Iter([1, 2])
console.log(it.next());
console.log(it.next());
console.log(it.next());


var p1 = new Promise((resolve, reject) => {
  reject(1)
})
var p2 = new Promise((resolve, reject) => {
  reject(2)
})

var p3 = new Promise((resolve, reject) => {
  resolve(3)
})


var p = Promise.race([p1, p2, p3])
setTimeout(() => {
  console.log(p);

}, 0);