var express = require('express');
var router = express.Router();

/* GET status page */
router.get('/', function(req, res, next) {
  res.send({status: 'ok'});
});

module.exports = router;
