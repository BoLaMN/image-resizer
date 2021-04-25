'use strict';
var filters;

filters = require('../filters');

module.exports = function(contents, callback) {
  var filter, handler;
  filter = this.modifiers.filter;
  if (typeof filter === 'undefined') {
    return callback();
  }
  handler = filters[filter];
  if (typeof handler === 'function') {
    handler(contents, callback);
  } else {
    console.error('no filter registered for', filter);
    callback();
  }
};
