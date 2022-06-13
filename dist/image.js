'use strict';
var Image, Response, config, formats, handle, keys, mimeTypes, parseQueryString, path, ref, sources,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

path = require('path');

Response = require('./response');

ref = require('./streams/file-type'), mimeTypes = ref.mimeTypes, formats = ref.formats;

parseQueryString = require('./streams/parse');

config = require('./config');

handle = require('./handler');

sources = require('./sources');

keys = require('./keys');

Image = (function() {
  function Image(arg, response) {
    this.params = arg.params, this.query = arg.query;
    this.process = bind(this.process, this);
    this.resp = new Response(response);
    this.expiry = config.IMAGE_EXPIRY;
    this.source = this.params.source;
    this.modifiers = parseQueryString(this.params);
    this.format = path.extname(this.params.url.pathname);
    this.output = path.extname(this.params.output);
    this.validate();
  }

  Image.property('output', {
    get: function() {
      return this._output;
    },
    set: function(value) {
      if (value == null) {
        value = 'jpeg';
      }
      this._output = value.toLowerCase().replace('.', '');
      if (this._output === 'jpg') {
        this._output = 'jpeg';
      }
    }
  });

  Image.property('format', {
    get: function() {
      return this._format;
    },
    set: function(value) {
      if (value == null) {
        value = '';
      }
      this._format = value.toLowerCase().replace('.', '');
      if (this._format === 'jpg') {
        this._format = 'jpeg';
      }
    }
  });

  Image.prototype.validate = function() {
    if (formats.input.indexOf(this.format) === -1) {
      return this.resp.handleError(new Error('The listed input format (' + this.format + ') is not valid.'));
    }
    this.output = this.output || formats.convert[this.format] || this.format;
    if (formats.output.indexOf(this.output) === -1) {
      return this.resp.handleError(new Error(this.output + ' is an invalid output type'));
    }
    this.mime = mimeTypes[this.output];
    if (keys('sources').indexOf(this.source) === -1) {
      return this.resp.handleError(new Error(this.output + ' is an invalid source type'));
    }
    if (config.EXCLUDE_SOURCES.indexOf(this.source) > -1) {
      return this.resp.handleError(new Error(type + ' is an excluded source'));
    }
    return this.fetch();
  };

  Image.prototype.process = function(err, stream) {
    var handleResponse;
    if (err) {
      console.error('handling error from source retrieval', err);
      return this.resp.handleError(err);
    }
    handleResponse = (function(_this) {
      return function(err, strm) {
        if (err) {
          return _this.resp.handleError(err);
        } else if (_this.modifiers.action === 'json') {
          return _this.resp.handleIdentity(strm, _this.expiry);
        } else {
          return _this.resp.handleImage(strm, _this.mime, _this.expiry);
        }
      };
    })(this);
    return handle(this, stream, handleResponse);
  };

  Image.prototype.fetch = function() {
    return sources[this.source](this, this.process);
  };

  return Image;

})();

module.exports = Image;
