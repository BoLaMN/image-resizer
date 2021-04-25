'use strict';
var Image, Request, Response, ref;

Image = require('./image');

ref = require('./request'), Request = ref.Request, Response = ref.Response;

exports.image = function() {
  return {
    headers: {},
    httpMethod: 'GET',
    pathParameters: {
      source: 'external',
      path: 'https://www.auto-brochures.com/makes/Audi/A7/Audi_US%20A7_2019.pdf'
    },
    queryStringParameters: {
      s: 100,
      w: 100,
      f: 'greyscale'
    },
    route: '/{source}/{path+}'
  };
};

exports.handler = function(event, context, callback) {
  var req, res;
  if (event.path === '/favicon.ico') {
    return callback(null, {
      statusCode: 200
    });
  }
  req = new Request(event);
  res = new Response(req, callback);
  new Image(req, res);
};
