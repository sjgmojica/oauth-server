/**
 * AppController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var shortId = require("shortid");
var rand = require("generate-key");
module.exports = {

  index: function(req, res) {
    console.log("dashboard");
    res.format({
      html: function() {
        res.view();
      },
      json: function() {
        res.notFound();
      }
    });
  },

  new: function(req, res) {
    console.log("new");
    res.format({
      html: function() {
        res.view();
      },
      json: function() {
        res.notFound();
      }
    });
  },

  create: function(req, res) {
    var id = shortId.generate();
    var key = rand.generateKey();
    var appName = req.param("appName");
    var appDesc = req.param("appDesc");
    var url = req.param("redirectUrl");
    var params = _.omitBy({
      name: appName,
      description: appDesc,
      redirect_url: url,
      secretId: id,
      secretKey: key
    }, _.isNil);
    async.auto({
      check: function (next) {
        App.findOne({name: appName}, function (err, app) {
          if (err) {
            return next(err);
          }
          if (app) {
            console.log("AppTaken");
            return next(new Exception.RecordAlreadyExists("AppsTaken"));
          }
          next();
        });
      },
      save: ["check", function (results, next) {
        App.create(params, function (err, app) {
          next(err, app);
        });
      }]
    }, function(err, results) {
      var app = _.get(results, "save", []);
      var payload = {};
      console.log(results);

      res.format({
        html: function() {
          if (err) {
            if (err.message === "AppsTaken") {
              console.log("custom error");
              req.addFlash("error", "App is already Exist")
            } else  {
              console.log("general error");
              req.addFlash("error", "Errors on saving data. fill out required fields");
            }
            res.redirect("/apps/new");
          }  else {
            payload = app;
            res.redirect("/apps");
          }
        },
        json: function() {
         payload = (err) ? err : app;

         if (err) {
           return res.apiError(payload);
         } else {
           res.apiSuccess(payload);
         }
        }
      });
    });
  },

  show: function(req, res) {
    App.find({ where: {sort: "createdAt DESC" }}, function(err, apps) {
      var payload = {};

      res.format({
        html: function() {
          payload.apps = apps;
          res.view(payload);
        },
        json: function() {
          payload = (err) ? err : apps;
          if (err) {
            return res.apiError(payload);
          } else {
            res.apiSuccess(payload);
          }
        }
      });
    });
  },

}
