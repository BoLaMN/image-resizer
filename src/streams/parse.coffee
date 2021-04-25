'use strict'

modifiers = require './modifiers'
keys = require '../keys'

config = require '../config'

limitDimension = (dimension, mods) ->
  maxDimension = parseInt(config.MAX_IMAGE_DIMENSION, 10)

  if dimension of mods and mods[dimension] > 0
    mods[dimension] = Math.min(maxDimension, mods[dimension])
  else
    mods[dimension] = maxDimension

  if mods.action is 'original'
    mods.action = 'resizeOriginal'

  null

parseModifiers = (query) ->
  mods = {}

  keys('modifiers').forEach (key) =>
    value = query[key]
    modifier = modifiers[key] or {}

    { values, coerce, fn, desc } = modifier

    if not value? and modifier.default
      val = modifier.default
    else if value? and typeof fn is 'function'
      value = coerce value

      if values and values.indexOf(value) > -1
        value = value.toLowerCase()

      val = fn value
    else return

    if typeof val is 'object'
      for own key, value of val
        mods[key] = value
    else
      mods[desc] = val

  if config.MAX_IMAGE_DIMENSION
    limitDimension 'width', mods
    limitDimension 'height', mods

  mods

module.exports = (query) ->
  { g, c, q } = modifiers

  mods = parseModifiers query

  if mods.action is 'json'
    return mods

  if mods.action is 'square'
    mods.crop = 'fill'
    return mods

  if mods.height isnt null or mods.width isnt null
    mods.action = 'resize'

    if mods.crop != c.default
      mods.action = 'crop'

    if mods.gravity != g.default
      mods.action = 'crop'

    if mods.x or mods.y
      mods.action = 'crop'

    mods
