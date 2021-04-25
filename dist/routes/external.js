var Image;

Image = require('../image');

module.exports = {
  description: 'This endpoint allows for images to be resized.',
  source: 'external',
  path: '/external/:path(.*)',
  method: 'GET',
  run: function(request, response) {
    new Image(request, response);
  }
};
