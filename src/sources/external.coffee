'use strict'

http = require 'http'
https = require 'https'

keys = require '../keys'

module.exports = ({ params, query }, callback) ->

  path = params.url.href

  handle = (stream) ->
    callback null, stream

  if path.startsWith 'https'
    protocol = https
  else
    protocol = http

  console.log "url: #{ path }"

  protocol.get path, handle

  return