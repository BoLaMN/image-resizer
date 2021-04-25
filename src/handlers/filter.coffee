'use strict'

filters = require '../filters'

module.exports = (contents, callback) ->

  filter = @modifiers.filter

  if typeof filter is 'undefined'
    return callback()

  handler = filters[filter]

  if typeof handler is 'function'
    handler contents, callback
  else
    console.error 'no filter registered for', filter
    callback()

  return
