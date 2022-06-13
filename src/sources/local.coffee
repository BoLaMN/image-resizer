'use strict'

{ LOCAL_FILE_PATH } = require '../config'
{ createReadStream } = require 'fs'
{ join } = require 'path'

module.exports = ({ params }, callback) ->
  file = join LOCAL_FILE_PATH, params.path

  handle = (stream) ->
    callback null, stream

  handle createReadStream file

  return