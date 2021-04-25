exports.Router = (function() {
  Router.createRouter = function(urlpattern, strict) {
    return new Router(urlpattern, strict);
  };

  function Router(url, strict) {
    var keys, re;
    this.keys = null;
    if (url instanceof RegExp) {
      this.rex = url;
      this.source = this.rex.source;
      return;
    }
    keys = [];
    this.source = url;
    url = url.replace(/\//g, '\\/').replace(/\./g, '\\.?').replace(/\*/g, '.+');
    url = url.replace(/:(\w+)(?:\(([^\)]+)\))?(\?)?/g, function(all, name, rex, atLeastOne) {
      keys.push(name);
      if (!rex) {
        rex = '[^\\/]' + (atLeastOne === '?' ? '*' : '+');
      }
      return '(' + rex + ')';
    });
    url = url.replace(/\\\/\(\[\^\\\/\]\*\)/g, '(?:\\/(\\w*))?');
    this.keys = keys;
    re = '^' + url;
    if (!strict) {
      re += '\\/?';
    }
    re += '$';
    this.rex = new RegExp(re);
    return;
  }

  Router.prototype.match = function(pathname) {
    var i, keys, l, m, match, value;
    m = this.rex.exec(pathname);
    match = null;
    if (m) {
      if (!this.keys) {
        return m.slice(1);
      }
      match = {};
      keys = this.keys;
      i = 0;
      l = keys.length;
      while (i < l) {
        value = m[i + 1];
        if (value) {
          match[keys[i]] = value;
        }
        i++;
      }
    }
    return match;
  };

  return Router;

})();
