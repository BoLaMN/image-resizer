'use strict'

sharp = require 'sharp'

handlers = require './handlers'

{ checkImageType } = require './streams/file-type'

module.exports = (image, stream, done) ->

  stream.on 'error', (err, resp) ->
    console.error 'stream error', err
    done err

  contents = stream.pipe sharp()

  count = 0

  finish = (err) ->
    if err
      done err
      done = ->
      return

    count += 1

    if count is fns.length
      done null, contents

  runner = (type) ->
    handlers[type].call image, contents, finish

  fns = [
    'resize'
    'filter'
    'optimize'
  ]

  stream.once 'data', (buffer) ->
    if not checkImageType buffer, image.format
      stream.destroy()

      return done new Error 'file does not match the input type given'

     if image.modifiers.action is 'json'
      return contents.metadata done

    fns.forEach runner
