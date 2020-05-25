// 实现1===2===3

// var a = {
//   value: 1,
//   valueOf: function () {
//     console.log(this.value);
//     this.value = this.value + 1
//     return this.value
//   }
// }

// console.log(a == 2 && a == 3 && a == 4);


function bubleSort(arr) {
  let len = arr.length
  if (len <= 1) return arr
  console.time()
  for (let i = 0; i < len; i++) {
    let temp = arr[i]
    for (let j = i - 1; j >= 0; j--) {
      if (arr[i] < arr[j]) {
        temp = arr[j]
        arr[j] = arr[i]
        arr[i] = temp
      }
    }
  }
  console.timeEnd()
  console.log(arr);
  return arr
}

var a = [10, 1, 35, 61, 89, 36, 55]

// bubleSort(a)


function inertSort(arr) {
  let len = arr.length
  if (len <= 1) return arr
  let temp
  console.time()
  for (let i = 0; i < len; i++) {
    temp = arr[i]
    let j = i - 1
    while (j > -1 && temp > arr[i + 1]) {
      arr[j + 1] = arr[j]
      j--
    }
    arr[j + 1] = temp
  }
  console.timeEnd()
  console.log(arr);
}

// inertSort(a)

var obj = new Proxy({}, {
  // set(target, propKey, value, receiver) {
  //   console.log('set');
  //   console.log(target, propKey, value, receiver);
  // },
  get(target, propKey, value) {
    console.log(target);
    console.log(propKey);
    console.log(value);
  },
  deleteProperty(target, propKey) {
    console.log(target);
    console.log(propKey);
  },
  defineProperty(target, propKey, propDesc) {
    console.log(target,propKey, propDesc);
  }
})

obj.a = 3
obj.b = 4
// console.log(obj);
delete obj.a


var str = Object.prototype.toString.call({})
console.log(str);
