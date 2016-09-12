/**
 * Middlewares
 */

var _ = require("lodash");
var fs = require("fs");
var path = require("path");

module.exports = loadMiddlewares();

//==============================================================================

function loadMiddlewares() {
  var dir = __dirname;
  var files = fs.readdirSync(dir).filter(function(f) {
    return /^(?!index)[^.].*\.js$/.test(f) && fs.statSync(path.join(dir, f)).isFile();
  });

  return _.reduce(files, function(out, f) {
    var key = _.camelCase(_.replace(f, /\.js$/, ""));
    out[key] = require(path.join(dir, f));
    return out;
  }, {});
}

//==============================================================================
