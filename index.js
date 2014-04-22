var less = require("less")
  , through = require('through')
  , path = require('path')
  , _ = require('underscore');

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

    var lessOpts = _.extend({
      filename: file,
      paths: [path.dirname(file)]
    }, opts);

    less.render(input, lessOpts, function(err, css) {
      if (err) {
        self.emit('error', err);
      } else {
        self.queue(jsToLoad(css));
      }
      self.queue(null);
    });
  }

  return through(write, end);
}
