var less = require("less")
  , through = require('through');

module.exports = function(file) {
  var input = '';
  if (/\.less$/i.test(file) === false) {
    return through(); 
  } 

  function write(data) { input += data; }
  function end() {
    var self = this;
    less.render(input, function(err, css) {
      if (err) throw new Error('Unable to parse less file: '+ file);
      css = css.replace(/\"/g, "\\\"").replace(/\n/g, "\\\n");
      var body = "var css = '"+ css +"';"+ 
                 "(require('lessify'))(css); module.exports = css;";
      self.queue(body);
      self.queue(null);
    });
  }

  return through(write, end);
}
