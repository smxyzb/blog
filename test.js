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

var obj = { a: 1 }

Object.defineProperty(obj, 'a', {
  enumerable: true,
  configurable: false,
  get() {
    console.log(22222);
    return 2222
  },
  set() {
    console.log(333);
    return 333
  }
})

obj.a = 2
console.log(obj);
console.log(Object.keys(obj));

var obj = {
  left: null,
  right: {
    
  }
}
var maxDepth = function (root) {
  if (root === null) { //注意等号
    return 0;
  } else {
    var leftDepth = 0;
    var rightDepth = 0
    if (root) {
      console.log(root);
      leftDepth = maxDepth(root.left)
      console.log(leftDepth);
      rightDepth = maxDepth(root.right)
      console.log(rightDepth);
    }
    var childDepth = leftDepth > rightDepth ? leftDepth : rightDepth;

    return childDepth + 1;//根节点不为空高度至少为1
  }
};
let str = JSON.stringify(obj)
console.log(str);
let nodeNums = str.match(/\w+/g).length
console.log(nodeNums);
let deepNum = maxDepth(obj)
console.log(deepNum);

var myArr = [55, 12, 35, 5, 325, 18, 2, 9, 11, 5, 12, 35, 76, 89]
var obj = {
}
myArr.forEach(item => {
  let key = item + ''
  obj[key] = {}
  obj[key].value = item
  obj[key].times = myArr.filter(i => i === item).length
})

console.log(obj);
var newObj = {}
for (const value of myArr) {
  if (!newObj[value]) {
    newObj[value] = {}
    newObj[value]['value'] = value
    newObj[value]['times'] = 1
  } else {
    newObj[value]['times'] += 1
  }
}
console.log(newObj);

var Obj2 = {}
for (const key in myArr) {
  let keys = myArr[key]
  if (!Obj2[keys]) {
    Obj2[keys] = {}
    Obj2[keys]['value'] = keys
    Obj2[keys]['times'] = 1
  } else {
    Obj2[keys]['times'] += 1
  }
}
console.log(Obj2);





