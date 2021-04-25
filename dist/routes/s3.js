var Image;

Image = require('../image');

module.exports = {
  description: 'This endpoint allows for images to be resized.',
  source: 's3',
  path: '/s3/:bucket/:path(.*)',
  method: 'GET',
  run: function(request, response) {
    new Image(request, response);
  }
};
