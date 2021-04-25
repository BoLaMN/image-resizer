'use strict'

{ NODE_ENV,
  CACHE_DEV_REQUESTS } = require './config'

{ Stream } = require 'stream'

class Response
  constructor: (@response) ->

  shouldCacheResponse: (expiry) ->
    if NODE_ENV is 'dev' and not CACHE_DEV_REQUESTS
      return false

    dt = Date.now()
    dt += expiry * 1000

    expires = new Date(dt).toGMTString()

    @response.setHeader 'Cache-Control', 'public'
    @response.setHeader 'Expires', expires
    @response.setHeader 'Last-Modified', new Date(1000).toGMTString()
    @response.setHeader 'Vary', 'Accept-Encoding'

    true

  handleError: ({ statusCode, message }) ->
    @response.statusCode = statusCode or 500
    @response.setHeader 'Content-Type', 'application/json'
    @response.json error: message

    false

  handleIdentity: (expiry) ->
    @shouldCacheResponse expiry

    @response.statusCode = 200
    @response.json json

    return

  handleImage: (image, mime, expiry) ->
    @shouldCacheResponse expiry

    if mime?
      @response.setHeader 'Content-Type', mime

    if image instanceof Stream
      image.pipe @response
    else
      @response.statusCode = 200
      @response.end image

    return

module.exports = Response