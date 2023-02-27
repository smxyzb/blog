function toBase2(num, arr = []) {
  var a = num % 2
  var y = num / 2
  if (y === 0) {
    arr.push(1)
  }
  arr.push(Math.floor(a))
  if (y > 1) {
    return toBase2(y, arr)
  }
  var reveseStr = arr.reverse().join('')
  return reveseStr.length === 8 ? reveseStr : 0 + reveseStr
}
console.log(toBase2(13));
function fuToBase2(num) {
  var base2 = toBase2(Math.abs(num))
  console.log(base2);
  var arr = base2.split('').map(i => {
    if (i > 0) {
      return 0
    }
    return 1
  })
  return Number(arr.join(''))+1
}
// console.log(fuToBase2(-83));

console.log([1, 2, 3].map((i,index)=>{
  return parseInt(i,index)
}));
console.log(parseInt(101,2));
console.log(parseInt(1,3));
