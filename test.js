

function Animal(name) {
  this.name = name
}
Animal.prototype.bark = function () {
  console.log('bark');
}

var d = new Animal()

console.log(d.__proto__ === Animal.prototype);


