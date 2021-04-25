'use strict'

fs = require 'fs'

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

exports.loadDirectoryModules = (dir) ->
  modules = {}
  names = []

  fs.readdirSync(dir).forEach (moduleFile) ->
    [ name, ext ] = moduleFile.split('.')

    if ext not in [ 'js', 'coffee' ]
      return

    try
      module = require dir + '/' + moduleFile
    catch e
      console.error dir + '/' + moduleFile, e
      return

    names.push name

    modules[name] = module

  console.log names.length + ' registered modules in ' + dir
  console.log '- ' + names.join ','

  modules._names = names
  modules