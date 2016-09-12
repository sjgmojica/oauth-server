module.exports.session = {

  secret: 'be9300d0e6750938804a8ccb96d3c20f',
  key: "session",
  prefix: "oauth:",
  ttl: 60*60*24, //-- 24 hours
  adapter: "redis",
  host: "localhost",
  port: 6379,
  db: 0
};
