'use strict';
var config, keys, limitDimension, modifiers, parseModifiers,
  hasProp = {}.hasOwnProperty;

modifiers = require('./modifiers');

keys = require('../keys');

config = require('../config');

limitDimension = function(dimension, mods) {
  var maxDimension;
  maxDimension = parseInt(config.MAX_IMAGE_DIMENSION, 10);
  if (dimension in mods && mods[dimension] > 0) {
    mods[dimension] = Math.min(maxDimension, mods[dimension]);
  } else {
    mods[dimension] = maxDimension;
  }
  if (mods.action === 'original') {
    mods.action = 'resizeOriginal';
  }
  return null;
};

parseModifiers = function(query) {
  var mods;
  mods = {};
  keys('modifiers').forEach((function(_this) {
    return function(key) {
      var coerce, desc, fn, modifier, results, val, value, values;
      value = query[key];
      modifier = modifiers[key] || {};
      values = modifier.values, coerce = modifier.coerce, fn = modifier.fn, desc = modifier.desc;
      if ((value == null) && modifier["default"]) {
        val = modifier["default"];
      } else if ((value != null) && typeof fn === 'function') {
        value = coerce(value);
        if (values && values.indexOf(value) > -1) {
          value = value.toLowerCase();
        }
        val = fn(value);
      } else {
        return;
      }
      if (typeof val === 'object') {
        results = [];
        for (key in val) {
          if (!hasProp.call(val, key)) continue;
          value = val[key];
          results.push(mods[key] = value);
        }
        return results;
      } else {
        return mods[desc] = val;
      }
    };
  })(this));
  if (config.MAX_IMAGE_DIMENSION) {
    limitDimension('width', mods);
    limitDimension('height', mods);
  }
  return mods;
};

module.exports = function(query) {
  var c, g, mods, q;
  g = modifiers.g, c = modifiers.c, q = modifiers.q;
  mods = parseModifiers(query);
  if (mods.action === 'json') {
    return mods;
  }
  if (mods.action === 'square') {
    mods.crop = 'fill';
    return mods;
  }
  if (mods.height !== null || mods.width !== null) {
    mods.action = 'resize';
    if (mods.crop !== c["default"]) {
      mods.action = 'crop';
    }
    if (mods.gravity !== g["default"]) {
      mods.action = 'crop';
    }
    if (mods.x || mods.y) {
      mods.action = 'crop';
    }
    return mods;
  }
};
