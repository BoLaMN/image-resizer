'use strict';
var gravity, xy;

gravity = function(arg, width, height, cropWidth, cropHeight) {
  var gravity, x, y;
  gravity = arg.gravity;
  cropWidth = cropWidth || cropHeight;
  cropHeight = cropHeight || cropWidth;
  x = width / 2 - (cropWidth / 2);
  y = height / 2 - (cropHeight / 2);
  switch (gravity) {
    case 'n':
      y = 0;
      break;
    case 'ne':
      x = width - cropWidth;
      y = 0;
      break;
    case 'nw':
      x = 0;
      y = 0;
      break;
    case 's':
      y = height - cropHeight;
      break;
    case 'se':
      x = width - cropWidth;
      y = height - cropHeight;
      break;
    case 'sw':
      x = 0;
      y = height - cropHeight;
      break;
    case 'e':
      x = width - cropWidth;
      break;
    case 'w':
      x = 0;
  }
  if (x < 0) {
    x = 0;
  }
  if (y < 0) {
    y = 0;
  }
  return {
    left: Math.floor(x),
    top: Math.floor(y),
    height: cropHeight,
    width: cropWidth
  };
};

xy = function(modifiers, width, height, cropWidth, cropHeight) {
  var dims, x, y;
  dims = gravity(modifiers, width, height, cropWidth, cropHeight);
  if (modifiers.x) {
    x = modifiers.x;
    if (x <= width - cropWidth) {
      dims.left = modifiers.x;
    } else {
      dims.left = width - cropWidth;
    }
  }
  if (modifiers.y) {
    y = modifiers.y;
    if (y <= height - cropHeight) {
      dims.top = modifiers.y;
    } else {
      dims.top = height - cropHeight;
    }
  }
  return dims;
};

exports.gravity = gravity;

exports.xy = xy;

exports.cropFill = function(modifiers, size) {
  var crop, cropHeight, cropWidth, ht, newHt, newWd, wd;
  modifiers.width = modifiers.width || modifiers.height;
  modifiers.height = modifiers.height || modifiers.width;
  if (modifiers.width > size.width) {
    cropWidth = size.width;
    if (modifiers.height <= size.height) {
      cropHeight = modifiers.height;
    } else {
      cropHeight = size.height;
    }
  } else {
    cropWidth = modifiers.width;
    if (modifiers.height <= size.height) {
      cropHeight = modifiers.height;
    } else {
      cropHeight = size.height;
    }
  }
  wd = newWd = cropWidth;
  ht = newHt = Math.round(newWd * size.height / size.width);
  if (newHt < cropHeight) {
    ht = newHt = cropHeight;
    wd = newWd = Math.round(newHt * size.width / size.height);
  }
  crop = xy(modifiers, newWd, newHt, cropWidth, cropHeight);
  return {
    resize: {
      width: wd,
      height: ht,
      top: 0,
      left: 0
    },
    crop: {
      width: cropWidth,
      height: cropHeight,
      left: crop.left,
      top: crop.top
    }
  };
};
