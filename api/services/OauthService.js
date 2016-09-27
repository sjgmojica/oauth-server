// var oauth2orize   = require("oauth2orize");
// var server = oauth2orize.createServer();



// // Generate access token for Implicit flow
// // Only access token is generated in this flow, no refresh token is issued
// server.grant(oauth2orize.grant.token(function(client, user, ares, done) {
//   AccessToken.destroy({ userId: user.id, clientId: client.clientId }, function (err) {
//     if (err){
//       return done(err);
//     } else {
//       AccessToken.create({ userId: user.id, clientId: client.clientId }, function(err, accessToken){
//         if(err) {
//           return done(err);
//         } else {
//           return done(null, accessToken.token);
//         }
//       });
//     }
//   });
// }));

// // Exchange authorization code for access token
// server.exchange(oauth2orize.exchange.code(function(client, code, redirectURI, done) {
//   AuthCode.findOne({
//                      code: code
//                    }).exec(function(err,code){
//                      if(err || !code) {
//                        return done(err);
//                      }
//                      if (client.clientId !== code.clientId) {
//                        return done(null, false);
//                      }
//                      if (redirectURI !== code.redirectURI) {
//                        return done(null, false);
//                      }

//                      // Remove Refresh and Access tokens and create new ones
//                      RefreshToken.destroy({ userId: code.userId, clientId: code.clientId }, function (err) {
//                        if (err) {
//                          return done(err);
//                        } else {
//                          AccessToken.destroy({ userId: code.userId, clientId: code.clientId }, function (err) {
//                            if (err){
//                              return done(err);
//                            } else {
//                              RefreshToken.create({ userId: code.userId, clientId: code.clientId }, function(err, refreshToken){
//                                if(err){
//                                  return done(err);
//                                } else {
//                                  AccessToken.create({ userId: code.userId, clientId: code.clientId }, function(err, accessToken){
//                                    if(err) {
//                                      return done(err);
//                                    } else {
//                                      return done(null, accessToken.token, refreshToken.token, { 'expires_in': sails.config.oauth.tokenLife });
//                                    }
//                                  });
//                                }
//                              });
//                            }
//                          });
//                        }
//                      });

//                    });
// }));

// // Exchange username & password for access token.
// server.exchange(oauth2orize.exchange.password(function(client, username, password, scope, done) {
//     User.findOne({ email: username }, function(err, user) {
//         if (err) { return done(err); }
//         if (!user) { return done(null, false); }

//         var pwdCompare = bcrypt.compareSync(password, user.hashedPassword);
//         if(!pwdCompare){ return done( null, false); };

//         // Remove Refresh and Access tokens and create new ones
//         RefreshToken.destroy({ userId: user.id, clientId: client.clientId }, function (err) {
//             if (err) {
//               return done(err);
//             } else {
//               AccessToken.destroy({ userId: user.id, clientId: client.clientId }, function (err) {
//                 if (err){
//                   return done(err);
//                 } else {
//                   RefreshToken.create({ userId: user.id, clientId: client.clientId }, function(err, refreshToken){
//                     if(err){
//                       return done(err);
//                     } else {
//                       AccessToken.create({ userId: user.id, clientId: client.clientId }, function(err, accessToken){
//                         if(err) {
//                           return done(err);
//                         } else {
//                           done(null, accessToken.token, refreshToken.token, { 'expires_in': sails.config.oauth.tokenLife });
//                         }
//                       });
//                     }
//                   });
//                 }
//               });
//             }
//         });
//     });
// }));

// // Exchange refreshToken for access token.
// server.exchange(oauth2orize.exchange.refreshToken(function(client, refreshToken, scope, done) {

//     RefreshToken.findOne({ token: refreshToken }, function(err, token) {

//         if (err) { return done(err); }
//         if (!token) { return done(null, false); }
//         if (!token) { return done(null, false); }

//         User.findOne({id: token.userId}, function(err, user) {

//             if (err) { return done(err); }
//             if (!user) { return done(null, false); }

//             // Remove Refresh and Access tokens and create new ones 
//             RefreshToken.destroy({ userId: user.id, clientId: client.clientId }, function (err) {
//               if (err) {
//                 return done(err);
//               } else {
//                 AccessToken.destroy({ userId: user.id, clientId: client.clientId }, function (err) {
//                   if (err){ 
//                     return done(err);
//                   } else {
//                     RefreshToken.create({ userId: user.id, clientId: client.clientId }, function(err, refreshToken){
//                       if(err){
//                         return done(err);
//                       } else {
//                         AccessToken.create({ userId: user.id, clientId: client.clientId }, function(err, accessToken){
//                           if(err) {
//                             return done(err);
//                           } else {
//                             done(null, accessToken.token, refreshToken.token, { 'expires_in': sails.config.oauth.tokenLife });
//                           }
//                         });
//                       }
//                     });
//                   }
//                 });
//               }
//            });
//         });
//     });
// }));



// module.exports = {

//   //********* PRIVATE *********//

//   _serializeClient: function () {

//     return function (client, done) {
//       console.log('serialize: inner');
//       // done(null, client.id);
//       process.nextTick(function () {
//         done(null, client.id);  
//       });
      
//     }
//     // console.log('seralized');
//     // server.serializeClient(function(client, done) {
//     //   // console.log('serialize: inner');
//     //   // console.log(client);
//     //   done(null, client.id);
//     // });
//   },

//   //-----------------
//   _deserializeClient: function () {
//     console.log('deseralized');
//     server.deserializeClient(function(id, done) {
//     console.log('deseralized inner');
//     Client.findOne(id, function(err, client) {
//       if (err) { return done(err); }
//         return done(null, client);
//       });
//     });  
//   },

//   //-----------------
//   _generateAuthCode: function () {
//     // Generate authorization code
//     server.grant(oauth2orize.grant.code(function(client, redirectURI, user, ares, done) {
//       console.log(' server.grant ');
//       AuthCode.create({
//                         clientId: client.clientId,
//                         redirectURI: redirectURI,
//                         userId: user.id,
//                         scope: ares.scope
//                       }).exec(function(err,code){
//                         if(err){return done(err,null);}
//                         return done(null,code.code);
//                       });
//     }));
 
//   },


//   //---------------

//   authorize: function (req, res, next) {

//     var auth = server.authorize(function(clientId, redirectURI, done) {
//       console.log('authorize');
//        Client.findOne({clientId: clientId}, function(err, client) {
//         if (err) { 
//           console.log(err);
//           return done(err); 
//         }
//         if (!client) { 
//           return done(null, false); 
//         }
//         return done(null, client);
//        });
//     });

//     auth(req, res, function (err, clientId, redirectURI) {
//       // console.log(err);
//       // console.log(clientId);
//       // console.log(redirectURI);
//       next(err, clientId, redirectURI);
//     });



//   },

//   //---------------
//   initialize: function () {

//     server.serializeClient(this._serializeClient());
//     ;
//     this._deserializeClient();
//     this._generateAuthCode();
//     return this;
//   }

// }.initialize();
