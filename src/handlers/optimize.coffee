'use strict'

config = require '../config'

module.exports = (contents, callback) ->

  if @output
    contents.toFormat @output,
      progressive: config.IMAGE_PROGRESSIVE
      quality: @modifiers.quality

  callback()

  return
