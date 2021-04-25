'use strict'

Image = require './image'

{ Request, Response } = require './request'

exports.image = ->
  headers: {}
  httpMethod: 'GET'
  pathParameters:
  	source: 'external'
  	path: 'https://www.auto-brochures.com/makes/Audi/A7/Audi_US%20A7_2019.pdf'
  queryStringParameters:
  	s: 100
  	w: 100
  	f: 'greyscale'
  route: '/{source}/{path+}'

exports.handler = (event, context, callback) ->
  if event.path is '/favicon.ico'
    return callback null, statusCode: 200

  req = new Request event
  res = new Response req, callback

  new Image req, res

  return
