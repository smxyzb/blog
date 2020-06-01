setImmediate(() => {
  console.log('setImmediate1')
  setTimeout(() => {
    console.log('setTimeout1')
  }, 0);
})
setTimeout(() => {
  console.log('setTimeout2')
  setImmediate(() => {
    console.log('setImmediate2')
  })
}, 0);