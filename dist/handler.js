'use strict';
var checkImageType, handlers, sharp;

sharp = require('sharp');

handlers = require('./handlers');

checkImageType = require('./streams/file-type').checkImageType;

module.exports = function(image, stream, done) {
  var contents, count, finish, fns, runner;
  stream.on('error', function(err, resp) {
    console.error('stream error', err);
    return done(err);
  });
  contents = stream.pipe(sharp());
  count = 0;
  finish = function(err) {
    if (err) {
      done(err);
      done = function() {};
      return;
    }
    count += 1;
    if (count === fns.length) {
      return done(null, contents);
    }
  };
  runner = function(type) {
    return handlers[type].call(image, contents, finish);
  };
  fns = ['resize', 'filter', 'optimize'];
  return stream.once('data', function(buffer) {
    if (!checkImageType(buffer, image.format)) {
      stream.destroy();
      return done(new Error('file does not match the input type given'));
    }
    if (image.modifiers.action === 'json') {
      return contents.metadata(done);
    }
    return fns.forEach(runner);
  });
};
