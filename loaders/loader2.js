const loaderUtils = require('loader-utils')
console.log(loaderUtils);

function loader(source) {
  console.log('loader2');
  
  return loaderUtils.getOptions(this)
}


module.exports = loader