'use strict';
var aws, client, config, e;

config = require('../config');

try {
  aws = require('aws-sdk');
  client = new aws.S3({
    accessKeyId: config.AWS_ACCESS_KEY_ID,
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY,
    region: config.AWS_REGION
  });
} catch (error) {
  e = error;
}

module.exports = function(arg, callback) {
  var bucket, handle, params, path;
  path = arg.path, params = arg.params;
  bucket = params.bucket;
  path = params.path;
  params = {
    Bucket: bucket,
    Key: path
  };
  if (!bucket) {
    return callback(new Error('no bucket found'));
  }
  if (!client) {
    return callback(new Error('no aws s3 client'));
  }
  handle = function(stream) {
    return callback(null, stream);
  };
  handle(client.getObject(params).createReadStream());
};
