var env;

env = require('../config');

module.exports = {
  description: 'This endpoint allows for images to be resized.',
  path: '/env',
  method: 'GET',
  run: function(request, response) {
    response.json(env);
  }
};
