var test = require('tape')
  , lessify = require('../')
  , through = require('through');

test('skips non-less files', function(t) {
  var result = ''
    , input  = 'test'
    , s = lessify('test.js'); 

  var ts = through(function(d) { result += d; }, function() {
    t.assert(result === input, 'should pass through non-less files');
    t.end();
  });

  s.pipe(ts);
  s.write(input);
  s.end();
});

test('should browserify less files', function(t) {
  var result = ''
    , s = lessify('test.less'); 

  var ts = through(function(d) { result += d; }, function() {
    t.assert(result.indexOf('width: 2') !== -1, 'should parse less');
    t.end();
  });

  s.pipe(ts);
  s.write('.nav { width: (1 + 1); }');
  s.end();
});

test('should throw on invalid less', function(t) {
  t.plan(1);
  var result = ''
    , s = lessify('test.less'); 

  s.write('.}');
  t.throws(function() { s.end(); }, Error, 'should throw on invalid less');
});
