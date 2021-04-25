keys = require '../keys'

module.exports =
  description: 'This endpoint allows for images to be resized.'

  path: '/modifiers'
  method: 'GET'

  run: (request, response) ->
    response.json keys('modifiers'), keys('filters'), keys('sources')

    return