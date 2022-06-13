'use strict';
var config, cropFill, gravity, ref;

config = require('../config');

ref = require('../streams/dimensions'), cropFill = ref.cropFill, gravity = ref.gravity;

module.exports = function(contents, callback) {
  var height, ref1, width;
  ref1 = this.modifiers, height = ref1.height, width = ref1.width;
  contents.metadata().then((function(_this) {
    return function(metadata) {
      var crop, grav, ref2, resize;
      switch (_this.modifiers.crop) {
        case 'fit':
          contents.resize({
            width: width,
            height: height,
            fit: 'inside'
          });
          break;
        case 'fill':
          ref2 = cropFill(_this.modifiers, metadata), crop = ref2.crop, resize = ref2.resize;
          contents.resize(resize).extract(crop);
          break;
        case 'cut':
          grav = gravity(_this.modifiers, metadata.width, metadata.height, width, height);
          contents.extract(grav);
          break;
        case 'scale':
          contents.resize({
            width: width,
            height: height
          });
          break;
        case 'pad':
          contents.resize({
            width: width,
            height: height,
            background: config.IMAGE_PADDING_COLOR || 'white',
            fit: 'contain',
            position: 0
          });
      }
      return callback();
    };
  })(this))["catch"](callback);
};
