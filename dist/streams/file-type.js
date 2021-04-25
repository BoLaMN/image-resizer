var bytes, offsets;

offsets = {
  webp: 8
};

bytes = {
  bmp: [0x42, 0x4D],
  gif: [0x47, 0x49, 0x46],
  jpeg: [0xFF, 0xD8, 0xFF],
  jxr: [0x49, 0x49, 0xBC],
  pdf: [0x25, 0x50, 0x44, 0x46],
  png: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
  tif: [0x4D, 0x4D, 0x2A, 0x0],
  tiff: [0x4D, 0x4D, 0x0, 0x2A],
  webp: [0x57, 0x45, 0x42, 0x50]
};

exports.formats = {
  input: ['bmp', 'gif', 'jpeg', 'jpg', 'jxr', 'pdf', 'png', 'tif', 'tiff', 'webp'],
  output: ['jpeg', 'png', 'webp'],
  convert: {
    pdf: 'png'
  }
};

exports.mimeTypes = {
  bmp: 'image/bmp',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  jxr: 'image/vnd.ms-photo',
  pdf: 'application/pdf',
  png: 'image/png',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  webp: 'image/webp'
};

exports.checkImageType = function(buffer, format) {
  var headers, offset;
  headers = bytes[format];
  offset = offsets[format] || 0;
  if (!headers) {
    return false;
  }
  return headers.every(function(header, idx) {
    return header === buffer[idx + offset];
  });
};
