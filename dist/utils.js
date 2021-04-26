'use strict';
var fs, path;

fs = require('fs');

path = require('path');

Function.prototype.property = function(prop, desc) {
  return Object.defineProperty(this.prototype, prop, desc);
};

exports.loadDirectoryModules = function(dir) {
  var modules, names;
  modules = {};
  names = [];
  fs.readdirSync(dir).forEach(function(file) {
    var e, ext, module, name;
    ext = path.extname(file);
    name = path.basename(file, ext);
    if ((ext !== '.js' && ext !== '.coffee') || name === 'index') {
      return;
    }
    try {
      module = require(dir + '/' + file);
    } catch (error) {
      e = error;
      console.error(dir + '/' + file, e);
      return;
    }
    names.push(name);
    return modules[name] = module;
  });
  console.log(names.length + ' registered modules in ' + path.basename(dir));
  console.log('- ' + names.join(','));
  modules._names = names;
  return modules;
};
