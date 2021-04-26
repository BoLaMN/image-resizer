'use strict'

path = require 'path'

config =
  AUTO_ORIENT: true
  AWS_ACCESS_KEY_ID: null
  AWS_REGION: null
  AWS_SECRET_ACCESS_KEY: null
  CACHE_DEV_REQUESTS: true
  EXCLUDE_SOURCES: []
  IMAGE_DIMENSION_LIMIT: 16383
  IMAGE_EXPIRY: 60 * 60 * 24 * 90
  IMAGE_EXPIRY_SHORT: 60 * 60 * 24 * 2
  IMAGE_PADDING_COLOR: 'white'
  IMAGE_PROGRESSIVE: true
  IMAGE_QUALITY: 100
  JSON_EXPIRY: 60 * 60 * 24 * 30
  LOCAL_FILE_PATH: path.resolve process.cwd()
  NAMED_MODIFIERS_ONLY: false
  NODE_ENV: 'development'
  REMOVE_METADATA: true
  RESIZE_PROCESS_ORIGINAL: true
  HOSTNAME: '0.0.0.0'
  PORT: 3000

configNames = Object.keys config

configNames.forEach (key) ->
  if not process.env[key]
    return

  config[key] = process.env[key]

  keyType = typeof config[key]

  if keyType is 'number'
    config[key] = +config[key]

  if config[key] is 'true'
    config[key] = true

  if config[key] is 'false'
    config[key] = false

module.exports = config
