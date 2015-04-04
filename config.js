var config = function(mode) {
  if (mode !== 'development' && mode !== 'production') {
    mode = 'development';
  }
  var appName = 'cohesion';
  var port = process.env.PORT || 8000;
  var dbUrl = process.env.MONGODB_URL || process.env.MONGOLAB_URI ||
    'localhost/' + appName;
  var debug = (mode === 'development');
  var sessionSecret = process.env.SESSION_SECRET || '45c24943d1be2a99f74f43defaceface';
  return {
    appName: appName,
    port: port,
    dbUrl: dbUrl,
    debug: debug,
    sessionSecret: sessionSecret,
  };
};

module.exports = function() {
    return config(process.env.NODE_ENV || 'development')
};
