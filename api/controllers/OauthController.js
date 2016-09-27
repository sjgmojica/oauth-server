/**
 * OauthController
 *
 * @description :: Server-side logic for managing Oauths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {

  authorize: function (req, res) {

    // console.log(req.oauth2);

    OauthService.authorize(req, res, function (err, result) {
      if (err) {
        res.json(200, err);
      }
      // console.log(err);
      // console.log(result);
      // console.log(redirectUri);
      console.log('yohoo1');
    });

    // server.authorize(function(clientId, redirectURI, done) {

    //   Client.findOne({clientId: clientId}, function(err, client) {
    //     if (err) { return done(err); }
    //     if (!client) { return done(null, false); }
    //     if (client.redirectURI != redirectURI) { return done(null, false); }
    //     return done(null, client, client.redirectURI);
    //   });
    // })    

    // console.log(req.oauth2);
    // console.log(OauthService);
    // OauthService.test();
    // console.log(OauthService.server);
    // OauthService.authorize(function () {
    //   console.log('OauthService.authorize');
    // })(req, res);

  



  }
	
}

