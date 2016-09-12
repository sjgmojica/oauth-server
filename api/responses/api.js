/**
 * API Response Handler
 *
 */

module.exports = function api (error, data, meta) {

  //-- Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  sails.log.silly("res.api() ::", error, data, meta);

  //-- Set status code
  res.status(200);

  var payload = {};

  (!_.isEmpty(error) || _.isArray(error)) && (payload.error = error);
  (!_.isEmpty(data) || _.isArray(data)) && (payload.data = data);
  (!_.isEmpty(meta) || _.isArray(meta)) && (payload.meta = meta);

  //-- Send payload
  res.json(payload);

};
