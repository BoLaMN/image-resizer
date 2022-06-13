'use strict';
var fs;

fs = require('fs');

Function.prototype.property = function(prop, desc) {
  return Object.defineProperty(this.prototype, prop, desc);
};

exports.loadDirectoryModules = function(dir) {
  var modules, names;
  modules = {};
  names = [];
  fs.readdirSync(dir).forEach(function(moduleFile) {
    var e, ext, module, name, ref;
    ref = moduleFile.split('.'), name = ref[0], ext = ref[1];
    if (ext !== 'js' && ext !== 'coffee') {
      return;
    }
    try {
      module = require(dir + '/' + moduleFile);
    } catch (error) {
      e = error;
      console.error(dir + '/' + moduleFile, e);
      return;
    }
    names.push(name);
    return modules[name] = module;
  });
  console.log(names.length + ' registered modules in ' + dir);
  console.log('- ' + names.join(','));
  modules._names = names;
  return modules;
};
