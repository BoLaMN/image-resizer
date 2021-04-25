module.exports =
  description: 'This endpoint allows for images to be resized.'

  path: '/favicon.ico'
  method: 'ALL'

  run: (request, response) ->
    response.statusCode = 404
    response.end()

    return