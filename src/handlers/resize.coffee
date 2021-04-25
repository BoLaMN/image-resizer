'use strict'

config = require '../config'
sizes = require '../sizes'

module.exports = (contents, callback) ->
  { action, crop } = @modifiers

  if action is 'original' and not config.RESIZE_PROCESS_ORIGINAL
    return callback()

  if action isnt 'crop' and crop isnt 'pad'
    contents.options.withoutEnlargement = true

  if config.AUTO_ORIENT
    contents.rotate()

  if not config.REMOVE_METADATA
    contents.withMetadata()

  handler = sizes[action].bind this

  if typeof handler is 'function'
    handler contents, callback
  else
    console.error 'no action registered for', action
    callback()

  return
