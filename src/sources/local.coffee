'use strict'

{ LOCAL_FILE_PATH } = require '../config'
{ createReadStream } = require 'fs'

path = require 'path'

module.exports = ({ params }, callback) ->
  file = path.join LOCAL_FILE_PATH, params.path

  handle = (stream) ->
    callback null, stream

  handle createReadStream file

  return