'use strict'

gravity = ({ gravity }, width, height, cropWidth, cropHeight) ->
  cropWidth = cropWidth or cropHeight
  cropHeight = cropHeight or cropWidth

  x = width / 2 - (cropWidth / 2)
  y = height / 2 - (cropHeight / 2)

  switch gravity
    when 'n'
      y = 0
    when 'ne'
      x = width - cropWidth
      y = 0
    when 'nw'
      x = 0
      y = 0
    when 's'
      y = height - cropHeight
    when 'se'
      x = width - cropWidth
      y = height - cropHeight
    when 'sw'
      x = 0
      y = height - cropHeight
    when 'e'
      x = width - cropWidth
    when 'w'
      x = 0

  if x < 0
    x = 0

  if y < 0
    y = 0

  left: Math.floor x
  top: Math.floor y
  height: cropHeight
  width: cropWidth

xy = (modifiers, width, height, cropWidth, cropHeight) ->
  dims = gravity modifiers, width, height, cropWidth, cropHeight

  if modifiers.x
    x = modifiers.x

    if x <= width - cropWidth
      dims.left = modifiers.x
    else
      dims.left = width - cropWidth

  if modifiers.y
    y = modifiers.y

    if y <= height - cropHeight
      dims.top = modifiers.y
    else
      dims.top = height - cropHeight

  dims

exports.gravity = gravity
exports.xy = xy

exports.cropFill = (modifiers, size) ->
  modifiers.width = modifiers.width or modifiers.height
  modifiers.height = modifiers.height or modifiers.width

  if modifiers.width > size.width
    cropWidth = size.width

    if modifiers.height <= size.height
      cropHeight = modifiers.height
    else
      cropHeight = size.height
  else
    cropWidth = modifiers.width

    if modifiers.height <= size.height
      cropHeight = modifiers.height
    else
      cropHeight = size.height

  wd = newWd = cropWidth
  ht = newHt = Math.round(newWd * size.height / size.width)

  if newHt < cropHeight
    ht = newHt = cropHeight
    wd = newWd = Math.round(newHt * size.width / size.height)

  crop = xy(modifiers, newWd, newHt, cropWidth, cropHeight)

  resize:
    width: wd
    height: ht
    top: 0
    left: 0
  crop:
    width: cropWidth
    height: cropHeight
    left: crop.left
    top: crop.top
