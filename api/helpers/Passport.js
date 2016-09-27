/*
 * Passport.
 *
 */

var passport = require("passport");
var moment = require('moment');
var LocalStrategy = require("passport-local").Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var BearerStrategy = require('passport-http-bearer').Strategy;
var ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
var _ = require("lodash");

module.exports = new Passport();

//==============================================================================
//-- constructor

function Passport(options) {
  var self = this;

  var _options = {
    usernameField: _.get(options, "usernameField", "username"),
    passwordField: _.get(options, "passwordField", "password"),
    passReqToCallback: true
  };

  //-- Passport session setup...
  passport.serializeUser(function(user, done) {
    self._serializeUser(user, done);
  });
  passport.deserializeUser(function(user, done) {
    self._deserializeUser(user, done);
  });

  //-- Use LocalStrategy...
  passport.use(new LocalStrategy(
    _options,
    function(req, username, password, done) {
      var params = {};
      _.set(params, _options.usernameField, username);
      _.set(params, _options.passwordField, password);

      //-- asynchronous verification
      process.nextTick(function() {
        self._authenticate(params, done);
      });
    }
  ));

passport.use(new BasicStrategy(

  function (username, password, done) {

      User.findOne({
          email: username
      }, function (err, user) {

          if (err) {
              return done(err);
          }
          if (!user) {
              return done(null, false);
          }
          bcrypt.compare(password, user.hashedPassword, function(err, res){
            if(err){
              return done(err, null);
            } else { 
              if (!res) {
                return done( null, false, { message: 'Invalid password' });
              } else { 
                return done(null, user);
              } 
            } 
          });
      });
  }));  


passport.use(new ClientPasswordStrategy(

function (clientId, clientSecret, done) {

    Client.findOne({
        clientId: clientId
    }, function (err, client) {
        if (err) {
            return done(err);
        }
        if (!client) {
            return done(null, false);
        }
        if (client.clientSecret != clientSecret) {
            return done(null, false);
        }
        return done(null, client);
    });
}));


/**
 * BearerStrategy
 *
 * This strategy is used to authenticate users based on an access token (aka a
 * bearer token).  The user must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
  function(accessToken, done) {

    AccessToken.findOne({token:accessToken}, function(err, token) {
      if (err) { return done(err); }
      if (!token) { return done(null, false); }

      var now = moment().unix();
      var creationDate = moment(token.createdAt).unix();

      if( now - creationDate > sails.config.oauth.tokenLife ) {
        AccessToken.destroy({ token: accessToken }, function (err) {
          if (err) return done(err);
         });
         console.log('Token expired');
         return done(null, false, { message: 'Token expired' });
       }

       var info = {scope: '*'};
       User.findOne({
         id: token.userId
       })
       .exec(function (err, user) {
         User.findOne({
           id: token.userId
         },done(err,user,info));
       });
    });
  }
));

  var _account = null;
  Object.defineProperty(self, "account", {
    get: function() {
      return _account || (_account = new AccountService());
    }
  });
}

//==============================================================================
//-- public

Passport.prototype.authenticate = function(done) {
  var self = this;

  return function(req, res) {
    passport.authenticate("local", function(err, user) {
      done(err, user);
    })(req, res);
  }
};

//==============================================================================
//-- private

Passport.prototype._authenticate = function(params, done) {
  var self = this;
  var options = { body: params };
  User.findOne({email: params.username}, done);
};

//------------------------------------------------------------------------------

Passport.prototype._serializeUser = function(user, done) {
  done(null, user);
};

//------------------------------------------------------------------------------

Passport.prototype._deserializeUser = function(user, done) {
  done(null, user);
};

//==============================================================================