'use strict'

module.exports = (contents, callback) ->

  contents
    .gamma()
    .greyscale()

  callback()

  return
