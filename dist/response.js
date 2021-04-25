'use strict';
var CACHE_DEV_REQUESTS, NODE_ENV, Response, Stream, ref;

ref = require('./config'), NODE_ENV = ref.NODE_ENV, CACHE_DEV_REQUESTS = ref.CACHE_DEV_REQUESTS;

Stream = require('stream').Stream;

Response = (function() {
  function Response(response) {
    this.response = response;
  }

  Response.prototype.shouldCacheResponse = function(expiry) {
    var dt, expires;
    if (NODE_ENV === 'dev' && !CACHE_DEV_REQUESTS) {
      return false;
    }
    dt = Date.now();
    dt += expiry * 1000;
    expires = new Date(dt).toGMTString();
    this.response.setHeader('Cache-Control', 'public');
    this.response.setHeader('Expires', expires);
    this.response.setHeader('Last-Modified', new Date(1000).toGMTString());
    this.response.setHeader('Vary', 'Accept-Encoding');
    return true;
  };

  Response.prototype.handleError = function(arg) {
    var message, statusCode;
    statusCode = arg.statusCode, message = arg.message;
    this.response.statusCode = statusCode || 500;
    this.response.setHeader('Content-Type', 'application/json');
    this.response.json({
      error: message
    });
    return false;
  };

  Response.prototype.handleIdentity = function(expiry) {
    this.shouldCacheResponse(expiry);
    this.response.statusCode = 200;
    this.response.json(json);
  };

  Response.prototype.handleImage = function(image, mime, expiry) {
    this.shouldCacheResponse(expiry);
    if (mime != null) {
      this.response.setHeader('Content-Type', mime);
    }
    if (image instanceof Stream) {
      image.pipe(this.response);
    } else {
      this.response.statusCode = 200;
      this.response.end(image);
    }
  };

  return Response;

})();

module.exports = Response;
