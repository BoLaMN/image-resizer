'use sctrict'

connect = require 'connect'
http    = require 'http'
methods = require 'methods'

querystring = require 'querystring'
url = require 'url'

{ Router } = require './router'

routes = require './routes'

class App
  constructor: (hostname = '0.0.0.0', port = 3000) ->
    @config = { hostname, port }
    @routes = []

    methods.forEach (method) =>
      @[method] = @createMethod method

    @all = @createMethod 'all'

    @loadRoutes()
    @listen()

  createMethod: (name) ->
    localRoutes = @routes[name.toUpperCase()] = []

    (urlpattern, handle, route, args...) ->
      middleware = null

      if args.length
        handle = args.pop()
        middleware = args.flat()

      if typeof handle isnt 'function'
        throw new TypeError 'handle must be function'

      localRoutes.push [
        new Router(urlpattern)
        handle
        middleware
        route
      ]

  loadRoutes: ->

    Object.keys(routes).forEach (routeName) =>
      route = routes[routeName]

      method = (route.method or 'GET').toLowerCase()
      dir = (route.path or '/').toLowerCase()

      handler = route.run or (args, done) ->
        return done new Error 'No handler specified for route.'

      @[method] dir, handler, route

  handleRequest: (req, res, next = ->) ->
    method = req.method.toUpperCase()

    req.app = @

    res.json = (obj) ->
      res.end JSON.stringify obj, null, 2

    localRoutes = @routes[method] or []
    allRoutes = @routes.ALL

    if allRoutes
      localRoutes = localRoutes.concat allRoutes

    if localRoutes.length > 0
      { pathname, query } = url.parse req.url

      for [ urlroute, handle, middleware, route ] in localRoutes
        match = urlroute.match pathname

        if not match
          continue

        req.query = querystring.parse query

        if not req.params
          req.params = match
        else
          for k, v of match
            req.params[k] = v

        req.params.source = route.source

        if not middleware?.length
          return handle req, res, next

        k = 0

        routeMiddleware = (err) ->
          mw = middleware[k++]

          if err
            errHandler = next
            errHandler err, req, res
          else if mw
            mw req, res, routeMiddleware
          else
            handle req, res, next

        return routeMiddleware()
        i++

    next()

  jsonParser: (req, res, next) ->
    buf = []

    req.setEncoding 'utf8'

    req.on 'data', (chunk) ->
      buf.push chunk

    req.on 'end', ->
      data = buf.join ''

      if data.length < 0
        req.body = {}
      else
        try
          req.body = JSON.parse data
        catch err
          req.body = {}

      next()

  listen: (callback = ->) ->
    server = connect()

    server.use @jsonParser.bind @
    server.use @handleRequest.bind @

    @server = http.createServer server

    @server.listen @config.port, @config.hostname, =>
      console.log ' server listening at: %s', @config.hostname + ':' + @config.port

      callback null, @server.address()

  close: (callback) ->
    @server.close callback

module.exports = new App()
