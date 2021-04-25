'use strict'

{ cropFill } = require '../streams/dimensions'

module.exports = (contents, callback) ->

  contents.metadata()
    .then (metadata) =>
      { crop, resize } = cropFill @modifiers, metadata

      contents
        .resize resize
        .extract crop

      callback()
    .catch callback

  return
