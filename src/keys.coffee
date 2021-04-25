keys = {}

fns =
  filters: -> require './filters'
  handlers: -> require './handlers'
  sizes: -> require './sizes'
  sources: -> require './sources'
  modifiers: -> require './streams/modifiers'

module.exports = (name) ->
  if keys[name]
    return keys[name]

  keys[name] = Object.keys fns[name]()
  keys[name]