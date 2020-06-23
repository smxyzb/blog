const loaderUtils = require('loader-utils')
console.log(loaderUtils);

function loader(source) {
  return loaderUtils.getOptions(this)
}


module.exports = loader