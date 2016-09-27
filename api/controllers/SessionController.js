/**
 * SessionController
 *
 * @description :: Server-side logic for managing Sessions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passportHelper = require("../helpers/Passport.js");
module.exports = {

  login: function (req, res) {

    res.view('session/login');


  },


  create: function (req, res) {
    passportHelper.authenticate( function (err, user) {
      req.login(user, function () {
        res.redirect("/");
      });
    })(req, res);
  }
  
};

