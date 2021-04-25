var env, fs;

env = require('../config');

fs = require('fs');

module.exports = {
  description: 'This endpoint allows for images to be resized.',
  path: '/test',
  method: 'GET',
  run: function(request, response) {
    var buf, contentType;
    buf = fs.readFileSync(env.LOCAL_FILE_PATH + '/test/index.html');
    response.charset = response.charset || 'utf-8';
    contentType = response.getHeader('Content-Type');
    response.setHeader('Content-Type', 'text/html');
    response.setHeader('Content-Length', buf.length);
    response.end(buf);
  }
};
