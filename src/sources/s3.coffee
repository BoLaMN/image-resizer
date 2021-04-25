'use strict'

config = require '../config'

try
  aws = require 'aws-sdk'

  client = new aws.S3
    accessKeyId: config.AWS_ACCESS_KEY_ID
    secretAccessKey: config.AWS_SECRET_ACCESS_KEY
    region: config.AWS_REGION
catch e

module.exports = ({ path, params }, callback) ->
  bucket = params.bucket
  path = params.path

  params =
    Bucket: bucket
    Key: path

  if not bucket
    return callback new Error 'no bucket found'

  if not client
    return callback new Error 'no aws s3 client'

  handle = (stream) ->
    callback null, stream

  handle client.getObject(params).createReadStream()

  return