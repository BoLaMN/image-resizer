'use strict';
var cropFill;

cropFill = require('../streams/dimensions').cropFill;

module.exports = function(contents, callback) {
  contents.metadata().then((function(_this) {
    return function(metadata) {
      var crop, ref, resize;
      ref = cropFill(_this.modifiers, metadata), crop = ref.crop, resize = ref.resize;
      contents.resize(resize).extract(crop);
      return callback();
    };
  })(this))["catch"](callback);
};
