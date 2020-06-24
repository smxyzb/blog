function Await(genF) {
  return new Promise((resolve, reject) => {
    const gen = genF()
    function step(nextF) {
      let next
      try {
        next = nextF()
      } catch (error) {
        reject(error)
      }
      if (next.done) {
       return resolve(next.value)
      }
      Promise.resolve(next.value).then((v) => {
        step(function name(params) {
          return gen.next(v)
        })
      })
    }

    step(function () {
      return gen.next()
    })
  })
}

function* genF() {
  yield 1
  yield 2
  yield 3
  return 4
}

var a = async function name(params) {
  let res = await Await(genF)
  console.log(res);

}
a()

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}