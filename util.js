var exports = {}

exports.lift = function(res, handler) {
  return function(err, resource) {
    if (err || !resource) {
      res.status(400);
      res.send({success: false});
    } else {
      handler(resource);
    }
  };
};

module.exports = exports;
