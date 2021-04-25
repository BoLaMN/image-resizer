'use strict';
module.exports = function(contents, callback) {
  contents.gamma().greyscale();
  callback();
};
