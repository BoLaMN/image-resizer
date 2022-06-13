'use strict'

config = require '../config'

{ cropFill, gravity } = require '../streams/dimensions'

module.exports = (contents, callback) ->
  { height, width } = @modifiers

  contents.metadata()
    .then (metadata) =>
      switch @modifiers.crop
        when 'fit'
          contents
            .resize { width, height, fit: 'inside' }
        when 'fill'
          { crop, resize } = cropFill @modifiers, metadata

          contents
            .resize resize
            .extract crop
        when 'cut'
          grav = gravity @modifiers, metadata.width, metadata.height, width, height

          contents.extract grav
        when 'scale'
          contents.resize { width, height }
        when 'pad'
          contents
            .resize {
              width, height
              background: config.IMAGE_PADDING_COLOR or 'white'
              fit: 'contain'
              position: 0
            }

      callback()
    .catch callback

  return
