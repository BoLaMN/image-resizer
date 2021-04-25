var fns, keys;

keys = {};

fns = {
  filters: function() {
    return require('./filters');
  },
  handlers: function() {
    return require('./handlers');
  },
  sizes: function() {
    return require('./sizes');
  },
  sources: function() {
    return require('./sources');
  },
  modifiers: function() {
    return require('./streams/modifiers');
  }
};

module.exports = function(name) {
  if (keys[name]) {
    return keys[name];
  }
  keys[name] = Object.keys(fns[name]());
  return keys[name];
};
