'use strict'

path = require 'path'

Response = require './response'

{ mimeTypes, formats } = require './streams/file-type'
parseQueryString = require './streams/parse'

config  = require './config'
handle  = require './handler'
sources = require './sources'
keys    = require './keys'

class Image
  constructor: ({ @params, @query }, response) ->
    @modifiers = parseQueryString @query
    @resp = new Response response

    @expiry = config.IMAGE_EXPIRY

    @format = path.extname @params.path
    @source = @params.source

    @validate()

  @property 'output',
    get: -> @_output
    set: (value = 'jpeg') ->
      @_output = value.toLowerCase().replace '.', ''

      if @_output is 'jpg'
        @_output = 'jpeg'

      return

  @property 'format',
    get: -> @_format
    set: (value = '') ->
      @_format = value.toLowerCase().replace '.', ''

      if @_format is 'jpg'
        @_format = 'jpeg'

      return

  validate: ->
    if formats.input.indexOf(@format) is -1
      return @resp.handleError new Error 'The listed input format (' + @format + ') is not valid.'

    @output = @output or formats.convert[@format] or @format

    if formats.output.indexOf(@output) is -1
      return @resp.handleError new Error @output + ' is an invalid output type'

    @mime = mimeTypes[@output]

    if keys('sources').indexOf(@source) is -1
      return @resp.handleError new Error @output + ' is an invalid source type'

    if config.EXCLUDE_SOURCES.indexOf(@source) > -1
      return @resp.handleError new Error type + ' is an excluded source'

    @fetch()

  process: (err, stream) =>
    if err
      console.error 'handling error from source retrieval', err
      return @resp.handleError err

    handleResponse = (err, strm) =>
      if err
        @resp.handleError err
      else if @modifiers.action is 'json'
        @resp.handleIdentity strm, @expiry
      else
        @resp.handleImage strm, @mime, @expiry

    handle @, stream, handleResponse

  fetch: ->
    sources[@source] @, @process

module.exports = Image
