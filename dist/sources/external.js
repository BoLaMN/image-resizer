'use strict';
var http, https, keys;

http = require('http');

https = require('https');

keys = require('../keys');

module.exports = function(arg, callback) {
  var handle, params, path, protocol, query;
  params = arg.params, query = arg.query;
  path = params.url.href;
  handle = function(stream) {
    return callback(null, stream);
  };
  if (path.startsWith('https')) {
    protocol = https;
  } else {
    protocol = http;
  }
  console.log("url: " + path);
  protocol.get(path, handle);
};
