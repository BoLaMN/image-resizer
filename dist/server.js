'use sctrict';
var App, Router, config, connect, http, methods, querystring, routes, url,
  slice = [].slice;

connect = require('connect');

http = require('http');

methods = require('methods');

querystring = require('querystring');

url = require('url');

Router = require('./router').Router;

config = require('./config');

routes = require('./routes');

App = (function() {
  function App() {
    this.config = {
      hostname: config.HOSTNAME,
      port: config.PORT
    };
    this.routes = [];
    methods.forEach((function(_this) {
      return function(method) {
        return _this[method] = _this.createMethod(method);
      };
    })(this));
    this.all = this.createMethod('all');
    this.loadRoutes();
    this.listen();
  }

  App.prototype.createMethod = function(name) {
    var localRoutes;
    localRoutes = this.routes[name.toUpperCase()] = [];
    return function() {
      var args, handle, middleware, route, urlpattern;
      urlpattern = arguments[0], handle = arguments[1], route = arguments[2], args = 4 <= arguments.length ? slice.call(arguments, 3) : [];
      middleware = null;
      if (args.length) {
        handle = args.pop();
        middleware = args.flat();
      }
      if (typeof handle !== 'function') {
        throw new TypeError('handle must be function');
      }
      return localRoutes.push([new Router(urlpattern), handle, middleware, route]);
    };
  };

  App.prototype.loadRoutes = function() {
    return Object.keys(routes).forEach((function(_this) {
      return function(routeName) {
        var dir, handler, method, route;
        route = routes[routeName];
        method = (route.method || 'GET').toLowerCase();
        dir = (route.path || '/').toLowerCase();
        handler = route.run || function(args, done) {
          return done(new Error('No handler specified for route.'));
        };
        return _this[method](dir, handler, route);
      };
    })(this));
  };

  App.prototype.handleRequest = function(req, res, next) {
    var allRoutes, handle, j, k, len, localRoutes, match, method, middleware, pathname, query, ref, ref1, route, routeMiddleware, urlroute, v;
    if (next == null) {
      next = function() {};
    }
    method = req.method.toUpperCase();
    req.app = this;
    res.json = function(obj) {
      return res.end(JSON.stringify(obj, null, 2));
    };
    localRoutes = this.routes[method] || [];
    allRoutes = this.routes.ALL;
    if (allRoutes) {
      localRoutes = localRoutes.concat(allRoutes);
    }
    if (localRoutes.length > 0) {
      ref = url.parse(req.url), pathname = ref.pathname, query = ref.query;
      for (j = 0, len = localRoutes.length; j < len; j++) {
        ref1 = localRoutes[j], urlroute = ref1[0], handle = ref1[1], middleware = ref1[2], route = ref1[3];
        match = urlroute.match(pathname);
        if (!match) {
          continue;
        }
        req.query = querystring.parse(query);
        if (!req.params) {
          req.params = match;
        } else {
          for (k in match) {
            v = match[k];
            req.params[k] = v;
          }
        }
        req.params.source = route.source;
        if (!(middleware != null ? middleware.length : void 0)) {
          return handle(req, res, next);
        }
        k = 0;
        routeMiddleware = function(err) {
          var errHandler, mw;
          mw = middleware[k++];
          if (err) {
            errHandler = next;
            return errHandler(err, req, res);
          } else if (mw) {
            return mw(req, res, routeMiddleware);
          } else {
            return handle(req, res, next);
          }
        };
        return routeMiddleware();
        i++;
      }
    }
    return next();
  };

  App.prototype.jsonParser = function(req, res, next) {
    var buf;
    buf = [];
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
      return buf.push(chunk);
    });
    return req.on('end', function() {
      var data, err;
      data = buf.join('');
      if (data.length < 0) {
        req.body = {};
      } else {
        try {
          req.body = JSON.parse(data);
        } catch (error) {
          err = error;
          req.body = {};
        }
      }
      return next();
    });
  };

  App.prototype.listen = function(callback) {
    var server;
    if (callback == null) {
      callback = function() {};
    }
    server = connect();
    server.use(this.jsonParser.bind(this));
    server.use(this.handleRequest.bind(this));
    this.server = http.createServer(server);
    return this.server.listen(this.config.port, this.config.hostname, (function(_this) {
      return function() {
        console.log(' server listening at: %s', _this.config.hostname + ':' + _this.config.port);
        return callback(null, _this.server.address());
      };
    })(this));
  };

  App.prototype.close = function(callback) {
    return this.server.close(callback);
  };

  return App;

})();

module.exports = new App();
