function flatArr(arr){
  // var newArr = arr.reduce((cur,next)=>{
  //   return cur.concat(Array.isArray(next) ? flatArr(next):next)
  // },[])
  // return newArr
  while (arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr)
  }
  return arr
}

var arr = [1,[2],[3,[4,[5]]]]
console.log(flatArr(arr));