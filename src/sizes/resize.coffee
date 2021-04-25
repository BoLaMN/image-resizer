'use strict'

module.exports = (contents, callback) ->
  { height, width } = @modifiers

  contents.resize { width, height, fit: 'inside' }

  callback()

  return
