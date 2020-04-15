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

bubleSort(a)


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

inertSort(a)


function findNum(arr) {
  let resultArr = new Set()
  let len = arr.length
  let a, b, c
  for (let i = 0; i < len; i++) {
    a = arr[i]
    console.log('a->:',a);
    for (let j = 0; j < len; j++) {
      b = arr[j]
      if (a !== b) {
        console.log('b->:', b);
        c = arr.find(item => {
          return a + b + item === 0
        })
        console.log('c->:', c);
        let newArr = [a, b, c].sort()
        if (c) {
          resultArr.push(newArr)
        }
      }
    }
  }

  console.log(resultArr);
  return resultArr
}

let arr = [-1, 0, 1, 2, -1, -4]
findNum(arr)