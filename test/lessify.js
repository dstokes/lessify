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

test('should pass less options', function(t) {
  var result = ''
    , s = lessify('mycss/test.less', {rootpath: 'mycss/'});

  var ts = through(function(d) { result += d; }, function() {
    var urlMatch = /url\(\\"(.*?)\\"\)/.exec(result)
    t.ok(urlMatch, 'should have background-image url');
    t.equal(urlMatch[1], 'mycss/images/cat.jpg', 'should honour rootpath');
    t.end();
  });

  s.pipe(ts);
  s.write('body { background-image: url("images/cat.jpg"); }');
  s.end();
});

test('should throw on invalid less', function(t) {
  t.plan(1);
  var result = ''
    , s = lessify('test.less');

  s.write('.}');
  t.throws(function() { s.end(); }, new RegExp('.*'), 'should throw on invalid less');
});

test('should not auto-inject when option set', function (t) {

  var result = ''
    , s = lessify('test.less', {"auto-inject": false});

  var ts = through(function(d) { result += d; }, function() {
    t.assert(result.indexOf('require(\'lessify\')') === -1, 'should not require lessify');
    t.end();
  });

  s.pipe(ts);
  s.write('.nav { width: (1 + 1); }');
  s.end();

});

test('should auto-inject by default', function (t) {

  var result = ''
    , s = lessify('test.less');

  var ts = through(function(d) { result += d; }, function() {
    t.assert(result.indexOf('require(\'lessify\')') !== -1, 'should require lessify');
    t.end();
  });

  s.pipe(ts);
  s.write('.nav { width: (1 + 1); }');
  s.end();

});
