/**
 * Middleware: miscellaneous
 */

module.exports = function() {
  return function(req, res, next) {
    //-- set title
    if (!_.isEmpty(sails.config.appTitle)) {
      res.locals.title = sails.config.appTitle;
    }

    next();
  };
};
