'use strict'

http = require 'http'
https = require 'https'

keys = require '../keys'

module.exports = ({ params, query }, callback) ->

  qury = Object.keys query
    .filter (key) -> keys('modifiers').indexOf(key) is -1
    .map (key) -> key + '=' + query[key]

  path = params.path + "?" + qury.join "&"

  handle = (stream) ->
    callback null, stream

  if path.startsWith 'https'
    protocol = https
  else
    protocol = http

  protocol.get path, handle

  return