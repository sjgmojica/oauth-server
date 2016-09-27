/**
 * ClientController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

  index: function(req, res) {
    Client.find({ where: {sort: "createdAt DESC" }}, function(err, clients) {
      var payload = {};
      payload.clients = clients;
      res.view("client/index", payload);
    });
  },

  new: function(req, res) {
    res.view("client/new");
  },

  create: function(req, res) {
    var clientName = req.param("clientName");
    var uri = req.param("redirectURI");
    var params = _.omitBy({
      name: clientName,
      redirectURI: uri
    }, _.isNil);

    async.auto({
      check: function (next) {
        Client.findOne({name: clientName}, function (err, client) {
          if (err) {
            return next(err);
          }

          if (client) {
            return next(new Exception.RecordAlreadyExists("ClientNameExist"));
          }
          next();
        });
      },
      save: ["check", function(results, next) {
        Client.create(params, function (err, client) {
          next(err, client);
        });
      }]
    }, function(err, results) {
      var client = _.get(results, "save", []);
      var payload = {};

      res.format({
        html: function() {
          if (err) {
            if (err.message === "ClientNameExist") {
              req.addFlash("error", "Client name is already Exist")
            } else  {
              req.addFlash("error", "Errors on saving data. fill out required fields");
            }
            res.redirect("/admin/clients/new");
          }  else {
            payload = client;
            res.redirect("/admin/clients");
          }
        },
        json: function() {
         payload = (err) ? err : client;

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
