'use strict';
var LOCAL_FILE_PATH, createReadStream, join;

LOCAL_FILE_PATH = require('../config').LOCAL_FILE_PATH;

createReadStream = require('fs').createReadStream;

join = require('path').join;

module.exports = function(arg, callback) {
  var file, handle, params;
  params = arg.params;
  file = join(LOCAL_FILE_PATH, params.path);
  handle = function(stream) {
    return callback(null, stream);
  };
  handle(createReadStream(file));
};
