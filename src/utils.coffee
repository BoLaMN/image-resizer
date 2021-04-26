'use strict'

fs = require 'fs'
path = require 'path'

Function::property = (prop, desc) ->
  Object.defineProperty @prototype, prop, desc

exports.loadDirectoryModules = (dir) ->
  modules = {}
  names = []

  fs.readdirSync(dir).forEach (file) ->
    ext = path.extname file
    name = path.basename file, ext

    if ext not in [ '.js', '.coffee' ] or name is 'index'
      return

    try
      module = require dir + '/' + file
    catch e
      console.error dir + '/' + file, e
      return

    names.push name

    modules[name] = module

  console.log names.length + ' registered modules in ' + path.basename(dir)
  console.log '- ' + names.join ','

  modules._names = names
  modules