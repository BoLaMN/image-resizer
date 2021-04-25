class exports.Router

  @createRouter: (urlpattern, strict) ->
    new Router(urlpattern, strict)

  constructor: (url, strict) ->
    @keys = null

    if url instanceof RegExp
      @rex = url
      @source = @rex.source
      return

    keys = []

    @source = url

    url = url.replace(/\//g, '\\/').replace(/\./g, '\\.?').replace(/\*/g, '.+')

    url = url.replace /:(\w+)(?:\(([^\)]+)\))?(\?)?/g, (all, name, rex, atLeastOne) ->
      keys.push name

      if !rex
        rex = '[^\\/]' + (if atLeastOne == '?' then '*' else '+')

      '(' + rex + ')'

    url = url.replace(/\\\/\(\[\^\\\/\]\*\)/g, '(?:\\/(\\w*))?')

    @keys = keys

    re = '^' + url

    if !strict
      re += '\\/?'

    re += '$'

    @rex = new RegExp(re)

    return

  match: (pathname) ->
    m = @rex.exec(pathname)

    match = null

    if m
      if !@keys
        return m.slice(1)

      match = {}
      keys = @keys

      i = 0
      l = keys.length

      while i < l
        value = m[i + 1]

        if value
          match[keys[i]] = value

        i++

    match

