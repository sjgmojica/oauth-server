/**
 * IntrospectController
 *
 * @description :: Server-side logic for managing Oauths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

   index: function(req, res) {
     var token = req.param("token");
     AccessToken.findOne({ token: token }, function(err, token) {
       if (err) {
         res.json(500, {error: "Internal Server Error"});
       }
       if (!token) {
         res.json(400, { "active": "false" });
       }
       if (token) {
         token.active = true;
         res.json(200, token);
       }
     });
   }
 }
