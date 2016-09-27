/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function(req, res) {
    User.find({where: { sort: "createdAt DESC" }}, function(err, users) {
      var payload = {};
      payload.users = users;
      res.view("user/index", payload)
    });
  },

  new: function(req, res) {
    res.view("user/new");
  },

  create: function(req, res) {
    var email = req.param("email");
    var password = req.param("password");
    var params = _.omitBy({
      email: email,
      password: password
    }, _.isNil);
    async.auto({
      check: function (next) {
        User.findOne({email: email}, function(err, user) {
          if (err) {
            return next(err);
          }

          if (user) {
            return next(new Exception.RecordAlreadyExists("EmailExist"));
          }

          next();
        });
      },
      save: ["check", function(results, next) {
        User.create(params, function (err, user) {
          next(err, user);
        });
      }]
    }, function(err, results) {
      var users = _.get(results, "save", []);
      var payload = {};

      res.format({
        html: function() {
          if (err) {
            if (err.message === "EmailExist") {
              req.addFlash("error", "Email Exist")
            } else {
              req.addFlash("error", "Errors on saving data. fill out required fields");
            }
            res.redirect("/admin/users/new");
          } else {
            payload = users;
            res.redirect("/admin/users");
          }
        },

        json: function() {
          payload = (err) ? err : users;

          if (err) {
            return res.apiError(payload);
          } else {
            res.apiSuccess(payload);
          }
        }
      });
    });
  }
}
