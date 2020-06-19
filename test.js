

function Animal(name) {
  this.name = name
}
Animal.prototype.bark = function () {
  console.log('bark');
}

var d = new Animal()

console.log(d.__proto__ === Animal.prototype);


let obj = {
  data: {

  },
  a: 1, b: 3, c: function name(params) {

  },
  [Symbol.iterator]() {
    let keyArr = Object.keys(obj)
    let index = 0
    return {
      next() {
        return index < keyArr.length ? {
          value: {
            key: keyArr[index],
            val: obj[keyArr[index++]]
          }
        } : {
            done: true
          }
      }
    }
  }
}

for (const iterator of obj) {
  console.log(iterator);
}


console.log(Object.values(obj));
