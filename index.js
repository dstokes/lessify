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

    function jsToLoad(css) {
      return "var css = "+ JSON.stringify(css) +";"+ 
             "(require('lessify'))(css); module.exports = css;";
    }

    lessOpts = opts || {};
    lessOpts.filename = file;
    lessOpts.paths = [path.dirname(file)];

    less.render(input, lessOpts, function(err, css) {
      if (err) {
        self.emit('error', new Error(err.message + ': ' + err.filename + '(' + err.line + ')'));
      } else {
        self.queue(jsToLoad(css));
      }
      self.queue(null);
    });
  }

  return through(write, end);
}
