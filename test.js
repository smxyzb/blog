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

// var arr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];

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

function sqrt(n) {
  if (isNaN(n)) return NaN;
  if (n === 0 || n === 1) return n;
  var low = 0,
    high = n,
    pivot = (low + high) / 2,
    lastPivot = pivot;

  do {
    console.log(low, high, pivot, lastPivot);
    if (Math.pow(pivot, 2) > n) {
      high = pivot;
    } else if (Math.pow(pivot, 2) < n) {
      low = pivot;
    } else {
      return pivot;
    }
    lastPivot = pivot;
    pivot = (low + high) / 2;
  } while (
    // 2018-04-25 22:08 更新
    // 使用Number.EPSILON表示能够接受的最小误差范围
    Math.abs(pivot - lastPivot) >= Number.EPSILON
  );

  return pivot;
}

// console.log(sqrt(9999));

function unique(arr) {

  var res = []
  var obj = {}

  for (let i = 0; i < arr.length; i++) {
    if (!obj[arr[i]]) {
      obj[arr[i]] = arr[i]
      res.push(arr[i])
    }
  }
  return res
}

var arr = [1, 2, 2, 3, 5, 3, 6, 5];
// console.log(unique(arr));


// async function async1() {
//   console.log('async1 start')
//   await async2();
//   console.log('async1 end')
// }
// async function async2() {
//   console.log('async2')
// }
// console.log('script start')
// setTimeout(function () {
//   console.log('setTimeout')
// }, 0)
// async1()
// new Promise(function (resolve) {
//   console.log('promise1')
//   resolve()
// }).then(function () {
//   console.log('promise2')
// })

// console.log('script end')


const data = [{
    id: 1,
    title: "课程1",
    children: [{
        id: 4,
        title: "课程1-1"
      },
      {
        id: 5,
        title: "课程1-2",
        children: [{
            id: 6,
            title: "课程1-2-1"
          },
          {
            id: 7,
            title: "课程1-2-2"
          },
        ],
      },
    ],
  },
  {
    id: 2,
    title: "课程2"
  },
  {
    id: 3,
    title: "课程3"
  },
];

function flatArr(list = [], defatltArr = [], keys = ['id', 'title']) {
  var newArr = defatltArr
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    var obj = {}
    keys.forEach((key) => {
      if (item[key]) {
        obj[key] = item[key]
      }
    })
    newArr.push(obj)
    if (item.children) {
      newArr = flatArr(item.children, newArr, keys)
    }
  }
  console.log(newArr);
  return newArr
}
// flatArr(data)


  const debounce = function (fn, wait = 1000, immedidate) {
    let timer = null
    return function () {
      const ctx = this
      const args = arguments
      if (timer) {
        clearTimeout(timer)
      }
      if (immedidate) {
        let runNow = !timer
        timer = setTimeout(() => {
          timer = null
        }, wait)
        if (runNow) fn.apply(ctx, args)
      } else {

        timer = setTimeout(() => {
          fn.apply(ctx, args)
        }, wait)
      }
    }
  }

let dt = debounce(flatArr, 1000, false)

console.log(dt(data, []));
