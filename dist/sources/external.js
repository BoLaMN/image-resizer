'use strict';
var http, https, keys;

http = require('http');

https = require('https');

keys = require('../keys');

module.exports = function(arg, callback) {
  var handle, params, path, protocol, query, qury;
  params = arg.params, query = arg.query;
  qury = Object.keys(query).filter(function(key) {
    return keys('modifiers').indexOf(key) === -1;
  }).map(function(key) {
    return key + '=' + query[key];
  });
  path = params.path + "?" + qury.join("&");
  handle = function(stream) {
    return callback(null, stream);
  };
  if (path.startsWith('https')) {
    protocol = https;
  } else {
    protocol = http;
  }
  protocol.get(path, handle);
};
