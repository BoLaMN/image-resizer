'use strict';
var config;

config = require('../config');

module.exports = function(contents, callback) {
  if (this.output) {
    contents.toFormat(this.output, {
      progressive: config.IMAGE_PROGRESSIVE,
      quality: this.modifiers.quality
    });
  }
  callback();
};
