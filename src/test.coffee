{ handler, image } = require './index'

obj = image()

console.log obj

module.exports = handler obj, null, -> console.log arguments
