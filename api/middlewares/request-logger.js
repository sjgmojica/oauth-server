/**
 * Middleware: request-logger
 */

module.exports = function() {
  return function(req, res, next) {
    if (sails.config.environment === "development") {
      sails.log.debug("Requested :: ", req.method, req.url);
    }
    next();
  };
};
