/**
 * sessionAuth
 * @module :: Policy
 *
 */

module.exports = function(req, res, next) {

  //-- continue only if authenticated...
  if (req.isAuthenticated()) {
    next();
  } else {
    res.redirect("/login");
  }
 
};
