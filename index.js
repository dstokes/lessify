var less = require("less")
  , through = require('through')
  , path = require('path');

module.exports = function(file, opts) {
  var input = '';
  if (/\.less$/i.test(file) === false) {
    return through();
  }

  function write(data) { input += data; }
  function end() {
    var self = this;
    var lessOpts = (opts || {});
    var autoInject = typeof(lessOpts['auto-inject']) == 'undefined' || !!lessOpts['auto-inject'];

    function jsToLoad(css) {
      var stringifiedCss = JSON.stringify(css);
      if (autoInject) {
        return "var css = "+ stringifiedCss +";(require('lessify'))(css); module.exports = css;";
      } else {
        return "module.exports = " + stringifiedCss;
      }
    }

    lessOpts.filename = file;
    lessOpts.paths = [path.dirname(file)];

    less.render(input, lessOpts, function(err, output) {
      if (err) {
        self.emit('error', new Error(err.message + ': ' + err.filename + '(' + err.line + ')'));
      } else {
        self.queue(jsToLoad(output.css));
      }
      output.imports.forEach(function(f) {
        self.emit('file', f);
      });
      self.queue(null);
    });
  }

  return through(write, end);
}
