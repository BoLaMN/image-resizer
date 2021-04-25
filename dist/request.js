var Readable, ServerResponse, calcTime,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ServerResponse = require('http').ServerResponse;

Readable = require('stream').Readable;

exports.Request = (function(superClass) {
  extend(Request, superClass);

  function Request(event) {
    Request.__super__.constructor.apply(this, arguments);
    this.method = event.httpMethod || 'GET';
    this.query = event.queryStringParameters || {};
    this.params = event.pathParameters || {};
    this.headers = event.headers || {};
    this.path = event.path || '/';
    console.log('new request', this.query, this.headers, this.params, this.path, this.method);
  }

  return Request;

})(Readable);

calcTime = function(epoch) {
  var d, utc;
  d = new Date(epoch);
  utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * 11);
};

exports.Response = (function(superClass) {
  extend(Response, superClass);

  function Response(req, callback) {
    var start;
    Response.__super__.constructor.call(this, {
      method: req.method,
      httpVersionMajor: 1,
      httpVersionMinor: 1
    });
    start = new Date().getTime();
    this._chunks = [];
    this.once('finish', (function(_this) {
      return function() {
        var base64, body, chunks, header, headers, key, name, ref, stop;
        chunks = Buffer.concat(_this._chunks);
        if (_this.statusCode === 200) {
          body = chunks.toString('base64');
          base64 = true;
        }
        if (typeof _this.getHeaders === "function" ? _this.getHeaders() : void 0) {
          headers = _this.getHeaders();
        } else {
          headers = {};
          ref = _this._headers;
          for (key in ref) {
            if (!hasProp.call(ref, key)) continue;
            header = ref[key];
            name = _this._headerNames[key];
            headers[name] = header;
          }
        }
        stop = new Date().getTime();
        console.log('start', calcTime(start));
        console.log('stop', calcTime(stop));
        console.log('elapsed', stop - start);
        return callback(null, {
          body: body || chunks.toString(),
          headers: headers || {},
          isBase64Encoded: base64 || false,
          statusCode: _this.statusCode || 200
        });
      };
    })(this));
  }

  Response.prototype.write = function(data, encoding, callback) {
    if (Buffer.isBuffer(data)) {
      this._chunks.push(data);
    } else {
      this._chunks.push(Buffer.from(data, encoding));
    }
    return true;
  };

  Response.prototype.end = function(data, encoding, callback) {
    if (data) {
      this.write(data, encoding);
    }
    Response.__super__.end.call(this, callback);
    return this.emit('finish');
  };

  Response.prototype.json = function(obj) {
    return this.end(JSON.stringify(obj));
  };

  return Response;

})(ServerResponse);
