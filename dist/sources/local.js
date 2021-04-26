'use strict';
var LOCAL_FILE_PATH, createReadStream, path;

LOCAL_FILE_PATH = require('../config').LOCAL_FILE_PATH;

createReadStream = require('fs').createReadStream;

path = require('path');

module.exports = function(arg, callback) {
  var file, handle, params;
  params = arg.params;
  file = path.join(LOCAL_FILE_PATH, params.path);
  handle = function(stream) {
    return callback(null, stream);
  };
  handle(createReadStream(file));
};
