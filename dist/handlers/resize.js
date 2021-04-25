'use strict';
var config, sizes;

config = require('../config');

sizes = require('../sizes');

module.exports = function(contents, callback) {
  var action, crop, handler, ref;
  ref = this.modifiers, action = ref.action, crop = ref.crop;
  if (action === 'original' && !config.RESIZE_PROCESS_ORIGINAL) {
    return callback();
  }
  if (action !== 'crop' && crop !== 'pad') {
    contents.options.withoutEnlargement = true;
  }
  if (config.AUTO_ORIENT) {
    contents.rotate();
  }
  if (!config.REMOVE_METADATA) {
    contents.withMetadata();
  }
  handler = sizes[action].bind(this);
  if (typeof handler === 'function') {
    handler(contents, callback);
  } else {
    console.error('no action registered for', action);
    callback();
  }
};
