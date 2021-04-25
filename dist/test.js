var handler, image, obj, ref;

ref = require('./index'), handler = ref.handler, image = ref.image;

obj = image();

console.log(obj);

module.exports = handler(obj, null, function() {
  return console.log(arguments);
});
