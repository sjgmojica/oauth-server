/**
 * API Success Response Handler
 *
 */

module.exports = function apiSuccess (data, options) {

  //-- Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  sails.log.silly("res.apiSuccess() ::", data, options);

  res.api(null, data, options);

};
