var exports = {};

exports.lift = function(res, handler) {
  return function(err, resource) {
    if (err || !resource) {
      res.status(400);
      res.send({success: false, error: err});
    } else {
      handler(resource);
    }
  };
};

exports.copy = function(obj) {
  return JSON.parse(JSON.stringify(obj));
};

module.exports = exports;
