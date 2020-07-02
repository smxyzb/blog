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


// function Iter(arr) {
//   let index = 0
//   return {
//     next(val) {
//       return index < arr.length ? { done: false, value: arr[index++] } : {
//         done: true, value: undefined
//       }
//     }
//   }
// }

// const it = Iter([1, 2])
// console.log(it.next());
// console.log(it.next());
// console.log(it.next());


var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];

// console.log(flatMap(arr));


// function New(f) {
//   var obj = {}
//   obj.__proto__ = f.prototype
//   var agrs = arguments.unshift()
//   var ret = f.apply(obj, agrs)
//   return ret instanceof Object ? ret : obj
// }


// var o = {}
// function instance_of(obj, source) {
//   let L = obj.__proto__
//   let O = source.prototype
//   while (L !== null) {
//     return L === O
//   }

//   L = L.__proto__

// }


// console.log(instance_of(o, Object));
// console.log(Array.isArray(new Set()));
// console.log(typeof []);

console.log([1, 3, 5, 2, 8, 6, 54].sort());

