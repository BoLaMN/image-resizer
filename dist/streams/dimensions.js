'use strict';
var gravity, xy;

gravity = function(arg, arg1, cropWidth, cropHeight) {
  var gravity, height, width, x, y;
  gravity = arg.gravity;
  width = arg1.width, height = arg1.height;
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

xy = function(modifiers, arg, cropWidth, cropHeight) {
  var dims, height, width, x, y;
  width = arg.width, height = arg.height;
  dims = gravity(modifiers, {
    width: width,
    height: height
  }, cropWidth, cropHeight);
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
  var crop, cropHeight, cropWidth, height, resize, width;
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
  width = cropWidth;
  height = Math.round(width * size.height / size.width);
  if (height < cropHeight) {
    height = cropHeight;
    width = Math.round(height * size.width / size.height);
  }
  resize = {
    width: width,
    height: height,
    top: 0,
    left: 0
  };
  crop = xy(modifiers, resize, cropWidth, cropHeight);
  return {
    resize: resize,
    crop: crop
  };
};
