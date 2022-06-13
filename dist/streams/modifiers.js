'use strict';
var IMAGE_DIMENSION_LIMIT, IMAGE_QUALITY, alpha, alphanumeric, formats, integer, keys, ref;

ref = require('../config'), IMAGE_QUALITY = ref.IMAGE_QUALITY, IMAGE_DIMENSION_LIMIT = ref.IMAGE_DIMENSION_LIMIT;

keys = require('../keys');

formats = require('./file-type').formats;

integer = function(v) {
  return parseInt(('' + v).replace(/[^0-9]/, '')) * 1;
};

alphanumeric = function(v) {
  return v.replace(/[^a-z0-9]/i, '');
};

alpha = function(v) {
  return v.replace(/[^a-z]/i, '');
};

module.exports = {
  h: {
    desc: 'height',
    coerce: integer,
    fn: function(height) {
      if (height > IMAGE_DIMENSION_LIMIT) {
        height = IMAGE_DIMENSION_LIMIT;
      }
      return height;
    }
  },
  w: {
    desc: 'width',
    coerce: integer,
    fn: function(width) {
      if (width > IMAGE_DIMENSION_LIMIT) {
        width = IMAGE_DIMENSION_LIMIT;
      }
      return width;
    }
  },
  s: {
    desc: 'square',
    coerce: integer,
    fn: function(value) {
      return {
        action: 'square',
        height: value,
        width: value
      };
    }
  },
  y: {
    desc: 'top',
    coerce: integer,
    fn: function(value) {
      return value;
    }
  },
  x: {
    desc: 'left',
    coerce: integer,
    fn: function(value) {
      return value;
    }
  },
  g: {
    desc: 'gravity',
    coerce: alpha,
    values: ['c', 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'],
    "default": 'c',
    fn: function(value) {
      return value;
    }
  },
  c: {
    desc: 'crop',
    coerce: alpha,
    values: ['fit', 'fill', 'cut', 'scale', 'pad'],
    "default": 'fit',
    fn: function(value) {
      return value;
    }
  },
  o: {
    desc: 'output',
    coerce: alpha,
    values: formats.output,
    "default": 'jpg',
    fn: function(value) {
      return value;
    }
  },
  f: {
    desc: 'filter',
    coerce: alpha,
    values: keys('filters'),
    fn: function(value) {
      return value;
    }
  },
  a: {
    desc: 'action',
    coerce: alpha,
    values: ['json', 'square', 'resize', 'crop'],
    "default": 'original',
    fn: function(value) {
      return value;
    }
  },
  q: {
    desc: 'quality',
    coerce: integer,
    range: [1, 100],
    "default": IMAGE_QUALITY,
    fn: function(value) {
      var max, min, ref1;
      ref1 = this.range, min = ref1[0], max = ref1[1];
      if (isNaN(value)) {
        value = min;
      }
      return Math.max(min, Math.min(max, value));
    }
  }
};
