'use strict';
module.exports = function(contents, callback) {
  var height, ref, width;
  ref = this.modifiers, height = ref.height, width = ref.width;
  contents.resize({
    width: width,
    height: height,
    fit: 'inside'
  });
  callback();
};
