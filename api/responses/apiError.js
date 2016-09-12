/**
 * API Error Response Handler
 *
 */

module.exports = function apiError (err, options) {

  //-- Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  sails.log.silly("res.apiError() ::", err, options);

  var error = new Exception.UnknownError();
  var meta = {};

  if (_.isString(err)) {
    if (err === "CSRF mismatch") {
      error = new Exception.InvalidCSRF();
    } else {
      error = new Exception.UnknownError(err);
    }
  } else if (_.isObject(err)) {
    if (err.code === "E_VALIDATION") {
      error = new Exception.ValidationError();
      if (_.has(err, "invalidAttributes")) {
        _.merge(meta, { invalidAttributes: _.keys(err.invalidAttributes) });
      }
    } else if (err instanceof Exception) {
      error = err;
    } else if (err instanceof Error) {
      error = new Exception.InternalServerError(err.message);
    }
  }

  var payload = {
    code: error.code,
    type: error.name,
    message: error.message
  };

  if (!_.isEmpty(options)) {
    _.merge(meta, options);
  }

  res.api(payload, null, meta);

};
