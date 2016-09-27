module.exports.routes = {

  //------------- USER -----------------//
  "GET /admin/users"             : "admin/User.index",
  "GET /admin/users/new"         : "admin/User.new",
  "POST /admin/users/create"     : "admin/User.create",

  //------------- CLIENT -----------------//
  "GET /"                        : "/admin/clients",
  "GET /admin/clients"           : "admin/Client.index",
  "GET /admin/clients/new"       : "admin/Client.new",
  "POST /admin/clients/create"   : "admin/Client.create",

  //------------- TEST ROUTES -----------------//
  "GET /api/info"         : "Api.info",


  "GET /test"         : {view: "test"},

  //------------- AUTH SERVER -----------------//
  // "GET /oauth/authorize" : "Oauth.authorize",


  //------------- LOGIN SERVER -----------------//
  "GET /login"          : "Session.login",
  "POST /login"          : "Session.create",
};
