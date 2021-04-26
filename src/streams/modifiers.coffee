'use strict'

{ IMAGE_QUALITY, IMAGE_DIMENSION_LIMIT } = require '../config'

keys = require '../keys'

{ formats } = require './file-type'

integer = (v) ->
  parseInt(('' + v).replace /[^0-9]/, '') * 1

alphanumeric = (v) ->
  v.replace(/[^a-z0-9]/i, '').toLowerCase()

alpha = (v) ->
  v.replace(/[^a-z]/i, '').toLowerCase()

module.exports =
  h:
    desc: 'height'
    coerce: integer
    fn: (height) ->
      if height > IMAGE_DIMENSION_LIMIT
        height = IMAGE_DIMENSION_LIMIT
      height

  w:
    desc: 'width'
    coerce: integer
    fn: (width) ->
      if width > IMAGE_DIMENSION_LIMIT
        width = IMAGE_DIMENSION_LIMIT
      width

  s:
    desc: 'square'
    coerce: integer
    fn: (value) ->
      action: 'square'
      height: value
      width: value

  y:
    desc: 'top'
    coerce: integer
    fn: (value) ->
      value

  x:
    desc: 'left'
    coerce: integer
    fn: (value) ->
      value

  g:
    desc: 'gravity'
    coerce: alpha
    values: [ 'c', 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw' ]
    default: 'c'
    fn: (value) ->
      value

  c:
    desc: 'crop'
    coerce: alpha
    values: [ 'fit', 'fill', 'cut', 'scale', 'pad' ]
    default: 'fit'
    fn: (value) ->
      value

  o:
    desc: 'output'
    coerce: alpha
    values: formats.output
    default: 'jpg'
    fn: (value) ->
      value

  f:
    desc: 'filter'
    coerce: alpha
    values: keys 'filters'
    fn: (value) ->
      value

  a:
    desc: 'action'
    coerce: alpha
    values: [ 'json', 'square', 'resize', 'crop' ]
    default: 'original'
    fn: (value) ->
      value

  q:
    desc: 'quality'
    coerce: integer
    range: [ 1, 100 ]
    default: IMAGE_QUALITY
    fn: (value) ->
      [ min, max ] = @range

      if isNaN value
        value = min

      Math.max min, Math.min(max, value)
