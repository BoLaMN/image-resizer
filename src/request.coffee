{ ServerResponse } = require 'http'
{ Readable } = require 'stream'

class exports.Request extends Readable
  constructor: (event) ->
    super

    @method = event.httpMethod or 'GET'
    @query = event.queryStringParameters or {}
    @params = event.pathParameters or {}

    if @params.path?
      url = decodeURIComponent @params.path

      @params.url = new URL url

    @headers = event.headers or {}
    @path = event.path or '/'

    console.log 'new request', @query, @headers, @params, @path, @method

calcTime = (epoch) ->
  d = new Date(epoch)
  utc = d.getTime() + d.getTimezoneOffset() * 60000

  new Date utc + 3600000 * 11

class exports.Response extends ServerResponse
  constructor: (req, callback) ->
    super
      method: req.method
      httpVersionMajor: 1
      httpVersionMinor: 1

    start = new Date().getTime()

    @_chunks = []

    @once 'finish', =>
      chunks = Buffer.concat @_chunks

      if @statusCode is 200
        body = chunks.toString 'base64'
        base64 = true

      if @getHeaders?()
        headers = @getHeaders()
      else
        headers = {}

        for own key, header of @_headers
          name = @_headerNames[key]
          headers[name] = header

      stop = new Date().getTime()

      console.log 'start', calcTime start
      console.log 'stop', calcTime stop
      console.log 'elapsed', stop - start

      callback null,
        body: body or chunks.toString()
        headers: headers or {}
        isBase64Encoded: base64 or false
        statusCode: @statusCode or 200

  write: (data, encoding, callback) ->
    if Buffer.isBuffer data
      @_chunks.push data
    else
      @_chunks.push Buffer.from data, encoding

    true

  end: (data, encoding, callback) ->
    if data
      @write data, encoding

    super callback

    @emit 'finish'

  json: (obj) ->
    @end JSON.stringify obj

